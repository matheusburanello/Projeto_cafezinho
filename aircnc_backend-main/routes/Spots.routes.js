const express = require('express'); // Importa framework Express
const multer = require('multer'); // Importa biblioteca para upload de arquivos

const SpotsController = require('../controllers/Spots.controller'); // Importa controller de spots
const router = express.Router(); // Cria instância do roteador Express

const uploadConfig = require('../config/upload'); // Importa configuração de upload
const upload = multer(uploadConfig); // Cria instância do multer com configuração

router.post('/', upload.single('thumbnail'), SpotsController.store) // Define rota POST para criar spot com upload de thumbnail
router.get('/', SpotsController.index) // Define rota GET para listar spots

module.exports = router // Exporta roteador configurado