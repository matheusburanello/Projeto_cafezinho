const multer = require('multer'); // Importa biblioteca para upload de arquivos
const path = require('path'); // Importa utilitário para manipulação de caminhos

module.exports = { // Exporta configuração do upload
    storage: multer.diskStorage({ // Configura armazenamento em disco
        destination: path.resolve(__dirname, '..', 'uploads'), // Define pasta de destino (uploads na raiz)
        filename: (req, file, cb) =>{ // Função para definir nome do arquivo
            const ext = path.extname(file.originalname); // Extrai extensão do arquivo original
            const name = path.basename(file.originalname, ext); // Extrai nome sem extensão

            cb(null, `${name}-${Date.now()}${ext}`); // Callback com nome único (nome-timestamp.extensão)
        }
    })
}

