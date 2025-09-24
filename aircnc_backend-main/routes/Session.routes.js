// index() = listagem de sessões
// show() = listar 1 sessão
// store() = criar 1 sessão
// update() = alterar 1 sessão
// destroy() = excluir 1 sessão
const express = require('express'); // Importa framework Express
const SessionController = require('../controllers/Session.controller'); // Importa controller de sessões
const router = express.Router(); // Cria instância do roteador Express

router.post('/', SessionController.store); // Define rota POST para criar/buscar sessão de usuário

module.exports = router; // Exporta roteador configurado