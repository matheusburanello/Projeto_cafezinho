const mongoose = require('mongoose'); // Importa biblioteca Mongoose para MongoDB

const SpotsSchema = new mongoose.Schema({ // Define schema dos spots
    thumbnail: String, // Nome do arquivo de thumbnail (tipo string)
    company: String, // Nome da empresa (tipo string)
    price: Number, // Preço do spot (tipo número)
    techs: [String], // Array de tecnologias (array de strings)
    user: { // Referência ao usuário proprietário
        type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId do MongoDB
        ref: 'User' // Referência ao modelo User
    }
}, { // Opções do schema
    toJSON: { // Configurações para serialização JSON
        virtuals: true, // Inclui campos virtuais na serialização
    }
});

//campo vritual criado para mostrar as imagens dos Spots
SpotsSchema.virtual('thumbnail_url').get(function(){ // Cria campo virtual que não é salvo no banco
    return `http://localhost:3335/files/${this.thumbnail}` // Retorna URL completa da imagem
})

module.exports = mongoose.model('Spots', SpotsSchema ) // Exporta modelo Spots baseado no schema