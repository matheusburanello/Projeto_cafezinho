const express = require('express'); // Importa framework Express
const router = express.Router(); // Cria instância do roteador Express
const BookingController = require('../controllers/Booking.controller') // Importa controller de reservas

// localhost:3335/bookings/113131313131/spots

router.post('/:spot_id/spots', BookingController.store); // Define rota POST para criar reserva em um local específico
router.post('/:booking_id/approvals', BookingController.storeApproval) // Define rota POST para aprovar uma reserva
router.post('/:booking_id/rejections', BookingController.storeRejection) // Define rota POST para rejeitar uma reserva

module.exports = router; // Exporta roteador configurado