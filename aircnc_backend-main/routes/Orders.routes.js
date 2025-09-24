const express = require('express'); // Importa framework Express para criar roteador
const Order = require('../models/Orders'); // Importa modelo Order para operações no banco
const Product = require('../models/Products'); // Importa modelo Product para validações

const router = express.Router(); // Cria instância do roteador Express

// GET /orders - Listar pedidos (com filtros opcionais)
router.get('/', async (req, res) => { // Define rota GET para listar pedidos
    try { // Bloco try para capturar erros
        const { status, user_id, limit = 50 } = req.query; // Extrai parâmetros de filtro da query string com limite padrão

        let filter = {}; // Objeto para construir filtros de busca no MongoDB
        if (status) filter.status = status; // Adiciona filtro de status se fornecido
        if (user_id) filter.user = user_id; // Adiciona filtro de usuário se fornecido

        const orders = await Order.find(filter) // Busca pedidos com filtros aplicados
            .populate('user', 'email') // Popula dados do usuário trazendo apenas email
            .populate('items.product', 'title price category') // Popula dados dos produtos nos itens
            .sort({ createdAt: -1 }) // Ordena por data de criação (mais recentes primeiro)
            .limit(parseInt(limit)); // Limita quantidade de resultados

        return res.json(orders); // Retorna pedidos encontrados em formato JSON
    } catch (error) { // Captura erros de execução
        console.error('Erro ao buscar pedidos:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// GET /orders/:id - Buscar pedido por ID
router.get('/:id', async (req, res) => { // Define rota GET para buscar pedido específico
    try { // Bloco try para capturar erros
        const { id } = req.params; // Extrai ID do pedido dos parâmetros da URL

        const order = await Order.findById(id) // Busca pedido pelo ID no banco
            .populate('user', 'email') // Popula dados do usuário trazendo apenas email
            .populate('items.product', 'title price category cover thumbnail'); // Popula dados completos dos produtos

        if (!order) { // Verifica se pedido foi encontrado
            return res.status(404).json({ error: 'Pedido não encontrado' }); // Retorna erro 404 se não encontrado
        }

        return res.json(order); // Retorna pedido encontrado em formato JSON
    } catch (error) { // Captura erros de execução
        console.error('Erro ao buscar pedido:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// POST /orders - Criar novo pedido
router.post('/', async (req, res) => { // Define rota POST para criar novo pedido
    try { // Bloco try para capturar erros
        const { user_id, items, customerName, customerPhone, notes } = req.body; // Extrai dados do corpo da requisição

        // Validações básicas
        if (!user_id || !items || !Array.isArray(items) || items.length === 0) { // Valida se dados obrigatórios foram fornecidos
            return res.status(400).json({ // Retorna erro 400 se validação falhar
                error: 'ID do usuário e itens são obrigatórios' // Mensagem de erro específica
            });
        }

        if (!customerName) { // Valida se nome do cliente foi fornecido
            return res.status(400).json({ // Retorna erro 400 se validação falhar
                error: 'Nome do cliente é obrigatório' // Mensagem de erro específica
            });
        }

        // Validar e calcular total
        let totalAmount = 0; // Variável para acumular valor total do pedido
        const orderItems = []; // Array para armazenar itens validados do pedido

        for (const item of items) { // Itera sobre cada item do pedido
            const { product_id, quantity } = item; // Extrai ID do produto e quantidade

            if (!product_id || !quantity || quantity <= 0) { // Valida se item tem dados válidos
                return res.status(400).json({ // Retorna erro 400 se validação falhar
                    error: 'Todos os itens devem ter product_id e quantity válidos' // Mensagem de erro específica
                });
            }

            // Buscar produto para validar e obter preço
            const product = await Product.findById(product_id); // Busca produto no banco pelo ID
            if (!product) { // Verifica se produto foi encontrado
                return res.status(400).json({ // Retorna erro 400 se produto não existe
                    error: `Produto ${product_id} não encontrado` // Mensagem de erro com ID do produto
                });
            }

            if (!product.available) { // Verifica se produto está disponível
                return res.status(400).json({ // Retorna erro 400 se produto indisponível
                    error: `Produto ${product.title} não está disponível` // Mensagem de erro com nome do produto
                });
            }

            const itemTotal = product.price * quantity; // Calcula valor total do item
            totalAmount += itemTotal; // Adiciona ao valor total do pedido

            orderItems.push({ // Adiciona item validado ao array
                product: product_id, // ID do produto
                quantity, // Quantidade solicitada
                price: product.price // Preço unitário no momento do pedido
            });
        }

        // Criar pedido
        const orderData = { // Objeto com dados do pedido para criação
            user: user_id, // ID do usuário que fez o pedido
            items: orderItems, // Array de itens validados
            totalAmount, // Valor total calculado
            customerName, // Nome do cliente
            customerPhone, // Telefone do cliente (opcional)
            notes // Observações do pedido (opcional)
        };

        const order = await Order.create(orderData); // Cria novo pedido no banco de dados

        // Buscar pedido criado com populate para retornar dados completos
        const populatedOrder = await Order.findById(order._id) // Busca pedido recém-criado
            .populate('user', 'email') // Popula dados do usuário
            .populate('items.product', 'title price category'); // Popula dados dos produtos

        return res.status(201).json(populatedOrder); // Retorna pedido criado com status 201
    } catch (error) { // Captura erros de execução
        console.error('Erro ao criar pedido:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// PUT /orders/:id/status - Atualizar status do pedido
router.put('/:id/status', async (req, res) => { // Define rota PUT para atualizar status
    try { // Bloco try para capturar erros
        const { id } = req.params; // Extrai ID do pedido dos parâmetros da URL
        const { status } = req.body; // Extrai novo status do corpo da requisição

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']; // Array com status válidos

        if (!status || !validStatuses.includes(status)) { // Valida se status fornecido é válido
            return res.status(400).json({ // Retorna erro 400 se status inválido
                error: `Status deve ser um dos seguintes: ${validStatuses.join(', ')}` // Lista status válidos
            });
        }

        const order = await Order.findByIdAndUpdate( // Busca e atualiza pedido em uma operação
            id, // ID do pedido a ser atualizado
            { status, updatedAt: Date.now() }, // Novos valores para status e data de atualização
            { new: true } // Retorna documento atualizado
        ).populate('user', 'email') // Popula dados do usuário
         .populate('items.product', 'title price category'); // Popula dados dos produtos

        if (!order) { // Verifica se pedido foi encontrado
            return res.status(404).json({ error: 'Pedido não encontrado' }); // Retorna erro 404 se não encontrado
        }

        return res.json(order); // Retorna pedido atualizado em formato JSON
    } catch (error) { // Captura erros de execução
        console.error('Erro ao atualizar status do pedido:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// GET /orders/user/:user_id - Buscar pedidos de um usuário específico
router.get('/user/:user_id', async (req, res) => { // Define rota GET para pedidos de usuário específico
    try { // Bloco try para capturar erros
        const { user_id } = req.params; // Extrai ID do usuário dos parâmetros da URL
        const { status, limit = 20 } = req.query; // Extrai filtros da query com limite padrão de 20

        let filter = { user: user_id }; // Objeto de filtro iniciado com ID do usuário
        if (status) filter.status = status; // Adiciona filtro de status se fornecido

        const orders = await Order.find(filter) // Busca pedidos com filtros aplicados
            .populate('items.product', 'title price category cover thumbnail') // Popula dados completos dos produtos
            .sort({ createdAt: -1 }) // Ordena por data de criação (mais recentes primeiro)
            .limit(parseInt(limit)); // Limita quantidade de resultados

        return res.json(orders); // Retorna pedidos encontrados em formato JSON
    } catch (error) { // Captura erros de execução
        console.error('Erro ao buscar pedidos do usuário:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// GET /orders/stats - Estatísticas de pedidos
router.get('/meta/stats', async (req, res) => { // Define rota GET para estatísticas de pedidos
    try { // Bloco try para capturar erros
        const stats = await Order.aggregate([ // Executa agregação para estatísticas por status
            { // Estágio de agrupamento
                $group: { // Agrupa documentos por status
                    _id: '$status', // Campo de agrupamento (status do pedido)
                    count: { $sum: 1 }, // Conta quantidade de pedidos por status
                    totalAmount: { $sum: '$totalAmount' } // Soma valor total por status
                }
            }
        ]);

        const totalOrders = await Order.countDocuments(); // Conta total de pedidos na coleção
        const totalRevenue = await Order.aggregate([ // Calcula receita total de pedidos entregues
            { $match: { status: { $in: ['delivered'] } } }, // Filtra apenas pedidos entregues
            { $group: { _id: null, total: { $sum: '$totalAmount' } } } // Soma valor total dos entregues
        ]);

        return res.json({ // Retorna objeto com todas as estatísticas
            byStatus: stats, // Estatísticas agrupadas por status
            totalOrders, // Total de pedidos
            totalRevenue: totalRevenue[0]?.total || 0 // Receita total ou 0 se não houver
        });
    } catch (error) { // Captura erros de execução
        console.error('Erro ao buscar estatísticas:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

module.exports = router; // Exporta roteador configurado para uso em outras partes da aplicação
