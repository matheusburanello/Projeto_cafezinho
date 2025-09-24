const mongoose = require('mongoose'); // Importa biblioteca Mongoose para modelagem de dados MongoDB

const ProductSchema = new mongoose.Schema({ // Cria novo schema para definir estrutura dos produtos
    title: { // Campo para nome/título do produto
        type: String, // Define tipo como string/texto
        required: true, // Torna campo obrigatório na criação
        trim: true // Remove espaços em branco no início e fim automaticamente
    },
    description: { // Campo para descrição detalhada do produto
        type: [String], // Define como array de strings para múltiplas descrições
        default: [] // Valor padrão é array vazio se não fornecido
    },
    price: { // Campo para preço do produto
        type: Number, // Define tipo como número para cálculos
        required: true, // Torna preço obrigatório
        min: 0 // Define valor mínimo como 0 (não permite preços negativos)
    },
    category: { // Campo para categoria do produto
        type: String, // Define tipo como string
        required: true, // Torna categoria obrigatória
        enum: ['Drinks', 'Sweets', 'Savory'], // Restringe valores apenas a essas 3 opções
        default: 'Drinks' // Define 'Drinks' como categoria padrão
    },
    ingredients: { // Campo para lista de ingredientes
        type: [String], // Define como array de strings
        default: [] // Valor padrão é array vazio
    },
    cover: { // Campo para nome do arquivo da imagem de capa
        type: String, // Define tipo como string (nome do arquivo)
        default: '' // Valor padrão é string vazia
    },
    thumbnail: { // Campo para nome do arquivo da imagem miniatura
        type: String, // Define tipo como string (nome do arquivo)
        default: '' // Valor padrão é string vazia
    },
    available: { // Campo para indicar se produto está disponível
        type: Boolean, // Define tipo como booleano (true/false)
        default: true // Valor padrão é true (disponível)
    },
    createdAt: { // Campo para data de criação do produto
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

// Campo virtual para URL completa da imagem de capa
ProductSchema.virtual('cover_url').get(function(){ // Cria campo virtual que não é salvo no banco
    return this.cover ? `http://localhost:3335/files/${this.cover}` : ''; // Retorna URL completa ou string vazia
});

// Campo virtual para URL completa da thumbnail
ProductSchema.virtual('thumbnail_url').get(function(){ // Cria campo virtual para URL da miniatura
    return this.thumbnail ? `http://localhost:3335/files/${this.thumbnail}` : ''; // Retorna URL completa ou string vazia
});

// Middleware para atualizar updatedAt antes de salvar
ProductSchema.pre('save', function(next) { // Middleware que executa antes de salvar documento
    this.updatedAt = Date.now(); // Atualiza campo updatedAt com data/hora atual
    next(); // Chama próximo middleware na cadeia
});

module.exports = mongoose.model('Product', ProductSchema); // Exporta modelo Product baseado no schema criado
