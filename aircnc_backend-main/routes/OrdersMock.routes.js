const express = require('express'); // Importa framework Express

const router = express.Router(); // Cria instância do roteador Express

// Armazenamento em memória para os pedidos (apenas para demonstração)
let mockOrders = []; // Array para armazenar pedidos em memória
let orderCounter = 1; // Contador para gerar IDs únicos de pedidos

// GET /orders - Listar pedidos
router.get('/', (req, res) => { // Define rota GET para listar pedidos
    try { // Bloco try para capturar erros
        const { status, user_id, limit = 50 } = req.query; // Desestrutura parâmetros de query com valor padrão

        let filteredOrders = mockOrders; // Inicia com todos os pedidos

        if (status) { // Se status foi especificado
            filteredOrders = filteredOrders.filter(o => o.status === status); // Filtra por status
        }

        if (user_id) { // Se ID do usuário foi especificado
            filteredOrders = filteredOrders.filter(o => o.user === user_id); // Filtra por usuário
        }

        const limitedOrders = filteredOrders.slice(0, parseInt(limit)); // Limita quantidade de resultados

        return res.json(limitedOrders); // Retorna pedidos filtrados e limitados
    } catch (error) { // Captura erros
        console.error('Erro ao buscar pedidos:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// GET /orders/:id - Buscar pedido por ID
router.get('/:id', (req, res) => { // Define rota GET para buscar pedido específico
    try { // Bloco try para capturar erros
        const { id } = req.params; // Desestrutura ID dos parâmetros da URL

        const order = mockOrders.find(o => o._id === id); // Busca pedido pelo ID

        if (!order) { // Se pedido não foi encontrado
            return res.status(404).json({ error: 'Pedido não encontrado' }); // Retorna erro 404
        }

        return res.json(order); // Retorna pedido encontrado
    } catch (error) { // Captura erros
        console.error('Erro ao buscar pedido:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// POST /orders - Criar novo pedido
router.post('/', (req, res) => { // Define rota POST para criar pedidos
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

        // Calcular total (simulado)
        let totalAmount = 0; // Variável para acumular valor total
        const orderItems = items.map(item => { // Mapeia itens do pedido
            const price = 8.50; // Preço simulado fixo para todos os produtos
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

        return res.status(201).json(newOrder); // Retorna pedido criado com status 201
    } catch (error) { // Captura erros
        console.error('Erro ao criar pedido:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// PUT /orders/:id/status - Atualizar status do pedido
router.put('/:id/status', (req, res) => { // Define rota PUT para atualizar status do pedido
    try { // Bloco try para capturar erros
        const { id } = req.params; // Desestrutura ID dos parâmetros da URL
        const { status } = req.body; // Desestrutura status do corpo da requisição

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']; // Array com status válidos

        if (!status || !validStatuses.includes(status)) { // Valida se status é válido
            return res.status(400).json({ // Retorna erro 400 se status inválido
                error: `Status deve ser um dos seguintes: ${validStatuses.join(', ')}` // Mensagem com status válidos
            });
        }

        const orderIndex = mockOrders.findIndex(o => o._id === id); // Busca índice do pedido no array

        if (orderIndex === -1) { // Se pedido não foi encontrado
            return res.status(404).json({ error: 'Pedido não encontrado' }); // Retorna erro 404
        }

        mockOrders[orderIndex].status = status; // Atualiza status do pedido
        mockOrders[orderIndex].updatedAt = new Date().toISOString(); // Atualiza data de modificação

        return res.json(mockOrders[orderIndex]); // Retorna pedido atualizado
    } catch (error) { // Captura erros
        console.error('Erro ao atualizar status do pedido:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// GET /orders/user/:user_id - Buscar pedidos de um usuário específico
router.get('/user/:user_id', (req, res) => { // Define rota GET para buscar pedidos de usuário específico
    try { // Bloco try para capturar erros
        const { user_id } = req.params; // Desestrutura ID do usuário dos parâmetros da URL
        const { status, limit = 20 } = req.query; // Desestrutura parâmetros de query com valor padrão

        let userOrders = mockOrders.filter(o => o.user === user_id); // Filtra pedidos do usuário específico

        if (status) { // Se status foi especificado
            userOrders = userOrders.filter(o => o.status === status); // Filtra também por status
        }

        const limitedOrders = userOrders.slice(0, parseInt(limit)); // Limita quantidade de resultados

        return res.json(limitedOrders); // Retorna pedidos do usuário filtrados e limitados
    } catch (error) { // Captura erros
        console.error('Erro ao buscar pedidos do usuário:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

// GET /orders/meta/stats - Estatísticas de pedidos
router.get('/meta/stats', (req, res) => { // Define rota GET para estatísticas de pedidos
    try { // Bloco try para capturar erros
        const stats = mockOrders.reduce((acc, order) => { // Reduz array de pedidos para estatísticas por status
            const existing = acc.find(s => s._id === order.status); // Busca se status já existe no acumulador
            if (existing) { // Se status já existe
                existing.count++; // Incrementa contador
                existing.totalAmount += order.totalAmount; // Adiciona valor ao total
            } else { // Se status não existe
                acc.push({ // Adiciona novo objeto de estatística
                    _id: order.status, // Status como ID
                    count: 1, // Contador inicial como 1
                    totalAmount: order.totalAmount // Valor inicial
                });
            }
            return acc; // Retorna acumulador
        }, []); // Inicia com array vazio

        const totalOrders = mockOrders.length; // Conta total de pedidos
        const totalRevenue = mockOrders // Calcula receita total
            .filter(o => o.status === 'delivered') // Filtra apenas pedidos entregues
            .reduce((sum, o) => sum + o.totalAmount, 0); // Soma valores dos pedidos entregues

        return res.json({ // Retorna objeto com estatísticas
            byStatus: stats, // Estatísticas por status
            totalOrders, // Total de pedidos
            totalRevenue // Receita total
        });
    } catch (error) { // Captura erros
        console.error('Erro ao buscar estatísticas:', error); // Loga erro no console
        return res.status(500).json({ error: 'Erro interno do servidor' }); // Retorna erro 500
    }
});

module.exports = router; // Exporta roteador configurado
