const Booking = require('../models/Booking'); // Importa modelo de reserva

const store = async (req,res) =>{ // Função assíncrona para criar nova reserva
    const { user_id } = req.headers; // Desestrutura ID do usuário dos headers
    const { spot_id } = req.params; // Desestrutura ID do spot dos parâmetros da URL
    const { date } = req.body; // Desestrutura data do corpo da requisição

    const booking = await Booking.create({ // Cria nova reserva no banco
        user: user_id, // ID do usuário
        spot: spot_id, // ID do spot
        date, // Data da reserva
    })

    await booking.populate(['spot', 'user']) // Popula dados do spot e usuário



    return res.json(booking) // Retorna reserva criada em JSON
}

const storeApproval = async(req,res) =>{ // Função assíncrona para aprovar reserva
    const { booking_id } = req.params; // Desestrutura ID da reserva dos parâmetros da URL
    const booking = await Booking.findById(booking_id).populate('spot') // Busca reserva por ID e popula spot

    console.log(booking); // Loga reserva no console

    await Booking.updateOne( // Atualiza reserva no banco
        {_id: booking_id}, // Filtro por ID
        { $set:{ approved: true} } // Define approved como true
    )

    return res.json(booking); // Retorna reserva em JSON
}

const storeRejection = async(req,res) =>{ // Função assíncrona para rejeitar reserva
    const { booking_id } = req.params; // Desestrutura ID da reserva dos parâmetros da URL
    const booking = await Booking.findById(booking_id).populate('spot') // Busca reserva por ID e popula spot

    console.log(booking); // Loga reserva no console

    await Booking.updateOne( // Atualiza reserva no banco
        {_id: booking_id}, // Filtro por ID
        { $set:{ approved: false} } // Define approved como false
    )

    return res.json(booking); // Retorna reserva em JSON
}

module.exports = { store, storeApproval, storeRejection } // Exporta funções do controller