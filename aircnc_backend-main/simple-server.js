const express = require('express'); // Importa framework web Express
const cors = require('cors'); // Importa middleware para Cross-Origin Resource Sharing

const app = express(); // Cria instância da aplicação Express

// Middlewares
app.use(express.json()); // Middleware para parsing de JSON no body das requisições
app.use(cors()); // Middleware para permitir requisições cross-origin

// Dados mock dos produtos
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

// Armazenamento em memória para os pedidos
let mockOrders = []; // Array para armazenar pedidos em memória
let orderCounter = 1; // Contador para gerar IDs únicos de pedidos

// Rota principal
app.get('/', (req, res) => { // Define rota GET para raiz da aplicação
    return res.json({ // Retorna resposta em JSON
        message: 'API Café Senac rodando (modo simples)...', // Mensagem de status
        endpoints: { // Objeto com endpoints disponíveis
            products: '/products', // Endpoint de produtos
            orders: '/orders' // Endpoint de pedidos
        }
    });
});

// ROTAS DE PRODUTOS

// GET /products - Listar todos os produtos
app.get('/products', (req, res) => { // Define rota GET para listar produtos
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
app.get('/products/:id', (req, res) => { // Define rota GET para buscar produto específico
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
app.get('/products/meta/categories', (req, res) => { // Define rota GET para listar categorias
    try { // Bloco try para capturar erros
        const categories = [...new Set(mockProducts.map(p => p.category))]; // Extrai categorias únicas dos produtos
        return res.json(categories); // Retorna array de categorias
    } catch (error) { // Captura erros
        console.error('Erro ao buscar categorias:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// ROTAS DE PEDIDOS

// POST /orders - Criar novo pedido
app.post('/orders', (req, res) => { // Define rota POST para criar pedidos
    try { // Bloco try para capturar erros
        const { user_id, items, customerName, customerPhone, notes } = req.body; // Desestrutura dados do corpo da requisição

        // Validações básicas
        if (!user_id || !items || !Array.isArray(items) || items.length === 0) { // Valida se dados obrigatórios estão presentes
            return res.status(400).json({ // Retorna erro 400 se validação falhar
                error: 'ID do usuário e itens são obrigatórios' // Mensagem de erro
            });
        }

        if (!customerName) { // Valida se nome do cliente foi fornecido
            return res.status(400).json({ // Retorna erro 400 se nome não fornecido
                error: 'Nome do cliente é obrigatório' // Mensagem de erro
            });
        }

        // Calcular total
        let totalAmount = 0; // Variável para acumular valor total
        const orderItems = items.map(item => { // Mapeia itens do pedido
            const product = mockProducts.find(p => p._id === item.product_id); // Busca produto pelo ID
            const price = product ? product.price : 8.50; // Usa preço do produto ou padrão
            totalAmount += price * item.quantity; // Adiciona ao total

            return { // Retorna objeto do item do pedido
                product: item.product_id, // ID do produto
                quantity: item.quantity, // Quantidade
                price: price // Preço unitário
            };
        });

        // Gerar número do pedido
        const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos do timestamp
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Número aleatório de 3 dígitos
        const orderNumber = `CF${timestamp}${random}`; // Monta número do pedido com prefixo CF

        // Criar pedido
        const newOrder = { // Objeto do novo pedido
            _id: `order_${orderCounter++}`, // ID único incrementando contador
            user: user_id, // ID do usuário
            items: orderItems, // Itens do pedido
            totalAmount, // Valor total
            status: 'pending', // Status inicial como pendente
            customerName, // Nome do cliente
            customerPhone, // Telefone do cliente
            notes, // Observações
            orderNumber, // Número do pedido
            createdAt: new Date().toISOString(), // Data de criação
            updatedAt: new Date().toISOString() // Data de atualização
        };

        mockOrders.push(newOrder); // Adiciona pedido ao array em memória

        console.log(`✅ Novo pedido criado: ${orderNumber} - ${customerName} - R$ ${totalAmount.toFixed(2)}`); // Loga criação do pedido

        return res.status(201).json(newOrder); // Retorna pedido criado com status 201
    } catch (error) { // Captura erros
        console.error('Erro ao criar pedido:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// GET /orders - Listar pedidos
app.get('/orders', (req, res) => { // Define rota GET para listar pedidos
    try { // Bloco try para capturar erros
        return res.json(mockOrders); // Retorna todos os pedidos em memória
    } catch (error) { // Captura erros
        console.error('Erro ao buscar pedidos:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// Rota de teste
app.get('/ping', (req, res) => { // Define rota GET para teste de conectividade
    console.log('recebeu ping'); // Loga no console que recebeu ping
    res.json({ message: 'pong', timestamp: new Date().toISOString() }); // Responde com pong e timestamp
});

// Iniciar servidor
const port = 3335; // Define porta do servidor
app.listen(port, () => { // Inicia servidor na porta especificada
    console.log(`🚀 Servidor rodando na porta ${port}`); // Loga que servidor iniciou
    console.log(`📱 API disponível em: http://localhost:${port}`); // Loga URL da API
    console.log(`🧪 Teste: http://localhost:${port}/ping`); // Loga URL de teste
    console.log(`☕ Produtos: http://localhost:${port}/products`); // Loga URL dos produtos
});

module.exports = app; // Exporta aplicação Express
