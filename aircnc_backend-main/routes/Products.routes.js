const express = require('express'); // Importa framework Express para criar roteador
const Product = require('../models/Products'); // Importa modelo Product para operações no banco
const multer = require('multer'); // Importa biblioteca para upload de arquivos
const path = require('path'); // Importa utilitário para manipular caminhos de arquivos

const router = express.Router(); // Cria instância do roteador Express

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({ // Configura armazenamento em disco para uploads
    destination: (req, file, cb) => { // Define pasta de destino dos arquivos
        cb(null, path.resolve(__dirname, '..', 'uploads')); // Salva na pasta uploads do projeto
    },
    filename: (req, file, cb) => { // Define nome do arquivo salvo
        const ext = path.extname(file.originalname); // Extrai extensão do arquivo original
        const name = path.basename(file.originalname, ext); // Extrai nome sem extensão
        cb(null, `${name}-${Date.now()}${ext}`); // Gera nome único com timestamp
    }
});

const upload = multer({ storage }); // Cria instância do multer com configuração de storage

// GET /products - Listar todos os produtos
router.get('/', async (req, res) => { // Define rota GET para listar produtos
    try { // Bloco try para capturar erros
        const { category, available } = req.query; // Extrai parâmetros de filtro da query string

        let filter = {}; // Objeto para construir filtros de busca no MongoDB
        if (category) filter.category = category; // Adiciona filtro de categoria se fornecido
        if (available !== undefined) filter.available = available === 'true'; // Adiciona filtro de disponibilidade

        const products = await Product.find(filter).sort({ createdAt: -1 }); // Busca produtos com filtros e ordena por data

        return res.json(products); // Retorna produtos encontrados em formato JSON
    } catch (error) { // Captura erros de execução
        console.error('Erro ao buscar produtos:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// GET /products/:id - Buscar produto por ID
router.get('/:id', async (req, res) => { // Define rota GET para buscar produto específico
    try { // Bloco try para capturar erros
        const { id } = req.params; // Extrai ID do produto dos parâmetros da URL

        const product = await Product.findById(id); // Busca produto pelo ID no banco

        if (!product) { // Verifica se produto foi encontrado
            return res.status(404).json({ error: 'Produto não encontrado' }); // Retorna erro 404 se não encontrado
        }

        return res.json(product); // Retorna produto encontrado em formato JSON
    } catch (error) { // Captura erros de execução
        console.error('Erro ao buscar produto:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// POST /products - Criar novo produto
router.post('/', upload.fields([ // Define rota POST com upload de múltiplos arquivos
    { name: 'cover', maxCount: 1 }, // Campo cover aceita máximo 1 arquivo
    { name: 'thumbnail', maxCount: 1 } // Campo thumbnail aceita máximo 1 arquivo
]), async (req, res) => { // Função assíncrona para processar criação
    try { // Bloco try para capturar erros
        const { title, description, price, category, ingredients, available } = req.body; // Extrai dados do corpo da requisição

        // Validações básicas
        if (!title || !price || !category) { // Verifica se campos obrigatórios foram fornecidos
            return res.status(400).json({ // Retorna erro 400 se validação falhar
                error: 'Título, preço e categoria são obrigatórios' // Mensagem de erro específica
            });
        }

        const productData = { // Objeto para armazenar dados do produto
            title, // Nome do produto
            description: description ? JSON.parse(description) : [], // Converte JSON ou usa array vazio
            price: parseFloat(price), // Converte preço para número decimal
            category, // Categoria do produto
            ingredients: ingredients ? JSON.parse(ingredients) : [], // Converte JSON ou usa array vazio
            available: available !== undefined ? available === 'true' : true // Converte string para boolean
        };

        // Adicionar arquivos se foram enviados
        if (req.files) { // Verifica se arquivos foram enviados
            if (req.files.cover) { // Verifica se arquivo de capa foi enviado
                productData.cover = req.files.cover[0].filename; // Adiciona nome do arquivo de capa
            }
            if (req.files.thumbnail) { // Verifica se arquivo de miniatura foi enviado
                productData.thumbnail = req.files.thumbnail[0].filename; // Adiciona nome do arquivo de miniatura
            }
        }

        const product = await Product.create(productData); // Cria novo produto no banco de dados

        return res.status(201).json(product); // Retorna produto criado com status 201
    } catch (error) { // Captura erros de execução
        console.error('Erro ao criar produto:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// PUT /products/:id - Atualizar produto
router.put('/:id', upload.fields([ // Define rota PUT com upload de múltiplos arquivos
    { name: 'cover', maxCount: 1 }, // Campo cover aceita máximo 1 arquivo
    { name: 'thumbnail', maxCount: 1 } // Campo thumbnail aceita máximo 1 arquivo
]), async (req, res) => { // Função assíncrona para processar atualização
    try { // Bloco try para capturar erros
        const { id } = req.params; // Extrai ID do produto dos parâmetros da URL
        const { title, description, price, category, ingredients, available } = req.body; // Extrai dados do corpo da requisição

        const product = await Product.findById(id); // Busca produto existente pelo ID

        if (!product) { // Verifica se produto foi encontrado
            return res.status(404).json({ error: 'Produto não encontrado' }); // Retorna erro 404 se não encontrado
        }

        // Atualizar campos
        if (title) product.title = title; // Atualiza título se fornecido
        if (description) product.description = JSON.parse(description); // Atualiza descrição se fornecida
        if (price) product.price = parseFloat(price); // Atualiza preço se fornecido
        if (category) product.category = category; // Atualiza categoria se fornecida
        if (ingredients) product.ingredients = JSON.parse(ingredients); // Atualiza ingredientes se fornecidos
        if (available !== undefined) product.available = available === 'true'; // Atualiza disponibilidade se fornecida

        // Atualizar arquivos se foram enviados
        if (req.files) { // Verifica se arquivos foram enviados
            if (req.files.cover) { // Verifica se arquivo de capa foi enviado
                product.cover = req.files.cover[0].filename; // Atualiza nome do arquivo de capa
            }
            if (req.files.thumbnail) { // Verifica se arquivo de miniatura foi enviado
                product.thumbnail = req.files.thumbnail[0].filename; // Atualiza nome do arquivo de miniatura
            }
        }

        await product.save(); // Salva alterações no banco de dados

        return res.json(product); // Retorna produto atualizado em formato JSON
    } catch (error) { // Captura erros de execução
        console.error('Erro ao atualizar produto:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// DELETE /products/:id - Deletar produto
router.delete('/:id', async (req, res) => { // Define rota DELETE para remover produto
    try { // Bloco try para capturar erros
        const { id } = req.params; // Extrai ID do produto dos parâmetros da URL

        const product = await Product.findByIdAndDelete(id); // Busca e remove produto pelo ID

        if (!product) { // Verifica se produto foi encontrado e removido
            return res.status(404).json({ error: 'Produto não encontrado' }); // Retorna erro 404 se não encontrado
        }

        return res.json({ message: 'Produto deletado com sucesso' }); // Retorna mensagem de sucesso
    } catch (error) { // Captura erros de execução
        console.error('Erro ao deletar produto:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// GET /products/categories - Listar categorias disponíveis
router.get('/meta/categories', async (req, res) => { // Define rota GET para listar categorias
    try { // Bloco try para capturar erros
        const categories = await Product.distinct('category'); // Busca valores únicos do campo category
        return res.json(categories); // Retorna categorias encontradas em formato JSON
    } catch (error) { // Captura erros de execução
        console.error('Erro ao buscar categorias:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

module.exports = router; // Exporta roteador configurado para uso em outras partes da aplicação
