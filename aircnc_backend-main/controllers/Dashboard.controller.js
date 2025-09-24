const Spots = require('../models/Spots'); // Importa modelo de spots

const index = async (req, res) => { // Função assíncrona para listar spots do usuário
    const { user_id } = req.headers; // Desestrutura ID do usuário dos headers

    // console.log(user_id) // Log comentado do ID do usuário

    const spots = await Spots.find({ user: user_id}) // Busca spots do usuário específico

    return res.json(spots); // Retorna spots em JSON
}

module.exports = { index } // Exporta função index