const mongoose = require('mongoose'); // Importa biblioteca Mongoose para MongoDB

const UserSchema = new mongoose.Schema({ // Define schema do usuário
    email: { // Campo email
        type: String, // Tipo string
        required: true, // Campo obrigatório
        unique: true, // Valor deve ser único no banco
    }
})

module.exports = mongoose.model('User', UserSchema); // Exporta modelo User baseado no schema