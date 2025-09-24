const express = require('express'); // Importa framework Express

const router = express.Router(); // Cria instância do roteador Express

// Dados mock dos produtos (baseados no frontend)
const mockProducts = [ // Array com dados estáticos de produtos para teste
    { // Primeiro produto: Expresso Cappuccino
        _id: "60d5ecb74f8a8b001f5e4e1a", // ID único do produto
        title: "Expresso Cappuccino", // Nome do produto
        description: ["cappuccino"], // Descrição em array
        price: 8.50, // Preço do produto
        category: "Drinks", // Categoria do produto
        ingredients: ["Espresso", "Milk", "White Chocolate Syrup", "Caramel Drizzle"], // Lista de ingredientes
        cover: "Coffe_1.png", // Nome do arquivo de capa
        thumbnail: "Coffe1.png", // Nome do arquivo de miniatura
        cover_url: "http://localhost:3335/files/Coffe_1.png", // URL completa da capa
        thumbnail_url: "http://localhost:3335/files/Coffe1.png", // URL completa da miniatura
        available: true, // Se produto está disponível
        createdAt: new Date().toISOString(), // Data de criação em ISO string
        updatedAt: new Date().toISOString() // Data de atualização em ISO string
    },
    { // Segundo produto: Expresso Latte
        _id: "60d5ecb74f8a8b001f5e4e1b", // ID único do produto
        title: "Expresso Latte", // Nome do produto
        description: ["Café cremoso com leite vaporizado"], // Descrição em array
        price: 7.50, // Preço do produto
        category: "Drinks", // Categoria do produto
        ingredients: ["Leite vaporizado", "Combinado com uma fina camada final de espuma de leite por cima"], // Lista de ingredientes
        cover: "Coffe_2.png", // Nome do arquivo de capa
        thumbnail: "Coffe2.png", // Nome do arquivo de miniatura
        cover_url: "http://localhost:3335/files/Coffe_2.png", // URL completa da capa
        thumbnail_url: "http://localhost:3335/files/Coffe2.png", // URL completa da miniatura
        available: true, // Se produto está disponível
        createdAt: new Date().toISOString(), // Data de criação em ISO string
        updatedAt: new Date().toISOString() // Data de atualização em ISO string
    },
    { // Terceiro produto: Expresso Americano
        _id: "60d5ecb74f8a8b001f5e4e1c", // ID único do produto
        title: "Expresso Americano", // Nome do produto
        description: ["Café americano tradicional"], // Descrição em array
        price: 6.00, // Preço do produto
        category: "Drinks", // Categoria do produto
        ingredients: ["Agua", "Cafe expresso"], // Lista de ingredientes
        cover: "Coffe_3.png", // Nome do arquivo de capa
        thumbnail: "Coffe3.png", // Nome do arquivo de miniatura
        cover_url: "http://localhost:3335/files/Coffe_3.png", // URL completa da capa
        thumbnail_url: "http://localhost:3335/files/Coffe3.png", // URL completa da miniatura
        available: true, // Se produto está disponível
        createdAt: new Date().toISOString(), // Data de criação em ISO string
        updatedAt: new Date().toISOString() // Data de atualização em ISO string
    },
    { // Quarto produto: Expresso Mocha
        _id: "60d5ecb74f8a8b001f5e4e1d", // ID único do produto
        title: "Expresso Mocha", // Nome do produto
        description: ["Café com chocolate"], // Descrição em array
        price: 9.00, // Preço do produto
        category: "Drinks", // Categoria do produto
        ingredients: ["Agua", "Leite vaporizado", "Caramelo"], // Lista de ingredientes
        cover: "Coffe_4.png", // Nome do arquivo de capa
        thumbnail: "Coffe4.png", // Nome do arquivo de miniatura
        cover_url: "http://localhost:3335/files/Coffe_4.png", // URL completa da capa
        thumbnail_url: "http://localhost:3335/files/Coffe4.png", // URL completa da miniatura
        available: true, // Se produto está disponível
        createdAt: new Date().toISOString(), // Data de criação em ISO string
        updatedAt: new Date().toISOString() // Data de atualização em ISO string
    }
];

// GET /products - Listar todos os produtos
router.get('/', (req, res) => { // Define rota GET para listar produtos
    try { // Bloco try para capturar erros
        const { category, available } = req.query; // Desestrutura parâmetros de query

        let filteredProducts = mockProducts; // Inicia com todos os produtos

        if (category) { // Se categoria foi especificada
            filteredProducts = filteredProducts.filter(p => p.category === category); // Filtra por categoria
        }

        if (available !== undefined) { // Se disponibilidade foi especificada
            filteredProducts = filteredProducts.filter(p => p.available === (available === 'true')); // Filtra por disponibilidade
        }

        return res.json(filteredProducts); // Retorna produtos filtrados
    } catch (error) { // Captura erros
        console.error('Erro ao buscar produtos:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// GET /products/:id - Buscar produto por ID
router.get('/:id', (req, res) => { // Define rota GET para buscar produto específico
    try { // Bloco try para capturar erros
        const { id } = req.params; // Desestrutura ID dos parâmetros da URL

        const product = mockProducts.find(p => p._id === id); // Busca produto pelo ID

        if (!product) { // Se produto não foi encontrado
            return res.status(404).json({ error: 'Produto não encontrado' }); // Retorna erro 404
        }

        return res.json(product); // Retorna produto encontrado
    } catch (error) { // Captura erros
        console.error('Erro ao buscar produto:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// GET /products/meta/categories - Listar categorias disponíveis
router.get('/meta/categories', (req, res) => { // Define rota GET para listar categorias
    try { // Bloco try para capturar erros
        const categories = [...new Set(mockProducts.map(p => p.category))]; // Extrai categorias únicas dos produtos
        return res.json(categories); // Retorna array de categorias
    } catch (error) { // Captura erros
        console.error('Erro ao buscar categorias:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

module.exports = router; // Exporta roteador configurado
