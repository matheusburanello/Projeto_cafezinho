const express = require('express'); // Importa framework Express para criar roteador
const SessionRoutes = require('./Session.routes'); // Importa rotas de autenticação e sessão de usuários
const SpotsRoutes = require('./Spots.routes'); // Importa rotas para gerenciamento de locais/spots
const DashboardRoutes = require('./Dashboard.routes'); // Importa rotas do painel administrativo
const BookingRoutes = require('./Booking.routes'); // Importa rotas para reservas e agendamentos
const ProductsRoutes = require('./Products.routes'); // Importa rotas para gerenciamento de produtos do café
const OrdersRoutes = require('./Orders.routes'); // Importa rotas para gerenciamento de pedidos

const router = express.Router(); // Cria instância do roteador Express para agrupar rotas

router.use('/session', SessionRoutes); // Registra rotas de sessão no caminho /session
router.use('/spots', SpotsRoutes); // Registra rotas de spots no caminho /spots
router.use('/dashboard', DashboardRoutes); // Registra rotas do dashboard no caminho /dashboard
router.use('/bookings', BookingRoutes); // Registra rotas de reservas no caminho /bookings
router.use('/products', ProductsRoutes); // Registra rotas de produtos no caminho /products
router.use('/orders', OrdersRoutes); // Registra rotas de pedidos no caminho /orders

module.exports = router; // Exporta roteador configurado para uso em outras partes da aplicação




