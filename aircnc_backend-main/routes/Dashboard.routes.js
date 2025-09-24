// index() = listagem de spots
const express = require('express'); // Importa framework Express
const DashboardController = require('../controllers/Dashboard.controller'); // Importa controller do dashboard
const router = express.Router(); // Cria instância do roteador Express

router.get('/', DashboardController.index); // Define rota GET para listar spots no dashboard

module.exports = router; // Exporta roteador configurado