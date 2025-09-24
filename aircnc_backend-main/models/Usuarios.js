const mongoose = require('mongoose'); // Importa biblioteca Mongoose para MongoDB

const UsuarioSchema = new mongoose.Schema({ // Define schema do usuário (versão em português)
    email: { // Campo email
        type: String, // Tipo string
        required: true, // Campo obrigatório
        unique: true, // Valor deve ser único no banco
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema) // Exporta modelo Usuario baseado no schema