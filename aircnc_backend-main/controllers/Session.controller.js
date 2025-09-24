const User = require('../models/User'); // Importa modelo de usuário

const store = async (req, res) => { // Função assíncrona para criar/buscar sessão de usuário
    const { email } = req.body; // Desestrutura email do corpo da requisição

    let usuario = await User.findOne({email}) // Busca usuário existente pelo email

    if(!usuario) usuario = await User.create({ email }) // Se não existe, cria novo usuário

    return res.json(usuario) // Retorna dados do usuário em JSON
}

module.exports = { store } // Exporta função store
