const User = require('../models/User'); // Importa modelo de usuário
const Spots = require('../models/Spots'); // Importa modelo de spots

const store = async (req,res) =>{ // Função assíncrona para criar novo spot
    const { company, price, techs } = req.body // Desestrutura dados do corpo da requisição
    const { user_id } = req.headers; // Desestrutura ID do usuário dos headers

    if (!req.file) // Valida se arquivo foi enviado
        return res.status(400).json({error: 'Arquivo não enviado'}) // Retorna erro se não há arquivo

    const { filename } = req.file; // Desestrutura nome do arquivo enviado

    // console.log(req.file); // Log comentado do arquivo

    const usuario = await User.findById(user_id); // Busca usuário por ID
    if(!usuario) return res.status(400).json({error:'Usuáro não existe!!!'}) // Retorna erro se usuário não existe

    const spot = await Spots.create({ // Cria novo spot no banco
        thumbnail: filename, // Nome do arquivo de thumbnail
        user: user_id, // ID do usuário proprietário
        company, // Nome da empresa
        price, // Preço do spot
        techs: techs.split(',').map(tech=> tech.trim()), // Divide tecnologias por vírgula e remove espaços
    })

    return res.json(spot) // Retorna spot criado em JSON
}

const index = async (req,res) =>{ // Função assíncrona para listar spots
    const { tech } = req.query // Desestrutura tecnologia dos parâmetros de query
    const spots = await Spots.find({ techs: tech}) // Busca spots que contêm a tecnologia

    return res.json(spots) // Retorna spots encontrados em JSON
}


module.exports = { store, index } // Exporta funções do controller

