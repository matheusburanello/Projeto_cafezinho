const mongoose = require('mongoose'); // Importa biblioteca Mongoose para MongoDB

const BookingSchema = new mongoose.Schema({ // Define schema das reservas
    date: String, // Data da reserva (tipo string)
    approved: Boolean, // Se a reserva foi aprovada (tipo boolean)
    user: { // Referência ao usuário que fez a reserva
        type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId do MongoDB
        ref:'User' // Referência ao modelo User
    },
    spot:{ // Referência ao spot reservado
        type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId do MongoDB
        ref:'Spots' // Referência ao modelo Spots
    }
});
module.exports = mongoose.model('Booking', BookingSchema) // Exporta modelo Booking baseado no schema