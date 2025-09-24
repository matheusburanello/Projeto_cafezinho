const mongoose = require('mongoose'); // Importa biblioteca Mongoose para modelagem de dados MongoDB

const OrderItemSchema = new mongoose.Schema({ // Cria schema para itens individuais do pedido
    product: { // Campo para referenciar produto
        type: mongoose.Schema.Types.ObjectId, // Define tipo como ObjectId do MongoDB
        ref: 'Product', // Cria referência ao modelo Product para populate
        required: true // Torna referência do produto obrigatória
    },
    quantity: { // Campo para quantidade do produto no pedido
        type: Number, // Define tipo como número
        required: true, // Torna quantidade obrigatória
        min: 1 // Define quantidade mínima como 1
    },
    price: { // Campo para preço unitário do produto no momento do pedido
        type: Number, // Define tipo como número
        required: true, // Torna preço obrigatório
        min: 0 // Define preço mínimo como 0
    }
});

const OrderSchema = new mongoose.Schema({ // Cria schema principal para pedidos
    user: { // Campo para referenciar usuário que fez o pedido
        type: mongoose.Schema.Types.ObjectId, // Define tipo como ObjectId do MongoDB
        ref: 'User', // Cria referência ao modelo User para populate
        required: true // Torna referência do usuário obrigatória
    },
    items: [OrderItemSchema], // Array de itens do pedido usando schema OrderItemSchema
    totalAmount: { // Campo para valor total do pedido
        type: Number, // Define tipo como número
        required: true, // Torna valor total obrigatório
        min: 0 // Define valor mínimo como 0
    },
    status: { // Campo para status atual do pedido
        type: String, // Define tipo como string
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'], // Restringe valores aos status válidos
        default: 'pending' // Define status padrão como 'pending'
    },
    customerName: { // Campo para nome do cliente
        type: String, // Define tipo como string
        required: true, // Torna nome do cliente obrigatório
        trim: true // Remove espaços em branco no início e fim
    },
    customerPhone: { // Campo para telefone do cliente
        type: String, // Define tipo como string
        trim: true // Remove espaços em branco no início e fim
    },
    notes: { // Campo para observações do pedido
        type: String, // Define tipo como string
        trim: true // Remove espaços em branco no início e fim
    },
    orderNumber: { // Campo para número único do pedido
        type: String, // Define tipo como string
        unique: true, // Garante que número do pedido seja único no banco
        required: true // Torna número do pedido obrigatório
    },
    createdAt: { // Campo para data de criação do pedido
        type: Date, // Define tipo como data
        default: Date.now // Valor padrão é data/hora atual
    },
    updatedAt: { // Campo para data da última atualização
        type: Date, // Define tipo como data
        default: Date.now // Valor padrão é data/hora atual
    }
}, { // Opções do schema
    toJSON: { // Configurações para serialização JSON
        virtuals: true, // Inclui campos virtuais na conversão para JSON
    }
});

// Middleware para gerar número do pedido antes de salvar
OrderSchema.pre('save', function(next) { // Middleware que executa antes de salvar documento
    if (this.isNew) { // Verifica se é um documento novo (primeira vez sendo salvo)
        // Gera um número de pedido único baseado na data e um número aleatório
        const timestamp = Date.now().toString().slice(-6); // Pega últimos 6 dígitos do timestamp atual
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Gera número aleatório de 3 dígitos
        this.orderNumber = `CF${timestamp}${random}`; // Monta número do pedido com prefixo CF
    }
    this.updatedAt = Date.now(); // Atualiza campo updatedAt com data/hora atual
    next(); // Chama próximo middleware na cadeia
});

module.exports = mongoose.model('Order', OrderSchema); // Exporta modelo Order baseado no schema criado
