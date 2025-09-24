require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env para process.env
const express = require('express'); // Importa o framework Express para criar servidor web
const cors = require('cors'); // Importa middleware para permitir requisições cross-origin
const path = require('path'); // Importa utilitário nativo do Node.js para manipular caminhos de arquivos
const mongoose = require('mongoose'); // Importa ODM (Object Document Mapper) para conectar com MongoDB

const socketio = require('socket.io'); // Importa biblioteca para comunicação em tempo real via WebSockets
const http = require('http'); // Importa módulo HTTP nativo do Node.js para criar servidor

const routes = require('./routes'); // Importa todas as rotas definidas no arquivo routes/index.js

const app = express(); // Cria uma instância da aplicação Express
// Habilitar o parser de JSON em todas as rotas
app.use(express.json()); // Middleware que converte automaticamente JSON do body das requisições
app.use(cors()); // Middleware que permite requisições de qualquer origem (CORS)

const server = http.createServer(app) // Cria servidor HTTP usando a aplicação Express
const io = socketio(server, { // Configura Socket.IO no servidor HTTP criado
    cors:{ // Configurações de CORS específicas para WebSocket
        origin: 'http://localhost:5173', // Define origem permitida para conexões WebSocket (frontend)
        methods: ['GET', 'POST'], // Métodos HTTP permitidos nas requisições WebSocket
        credentials: true // Permite envio de cookies e credenciais nas conexões
    }
});
const connectedUsers = {}; // Objeto para armazenar usuários conectados via WebSocket

io.on('connection', socket => { // Escuta evento de nova conexão WebSocket
    console.log('Usuário conectado', socket.id) // Loga ID único do socket conectado
    // //enviar
    // socket.emit('message', 'Quero reservar um spot') // Exemplo comentado de como enviar mensagem para cliente
    // //escutar
    // socket.on('message', data =>{ // Exemplo comentado de como escutar mensagens do cliente
    //     console.log(data); // Exemplo comentado de como processar dados recebidos
    // })

    // recuperar o id do usuário do frontend
    const { user_id } = socket.handshake.query; // Extrai user_id dos parâmetros de query da conexão WebSocket
    if (user_id) { // Verifica se user_id foi fornecido na conexão
        if(!connectedUsers[user_id]){ // Verifica se usuário ainda não está no objeto de conectados
            connectedUsers[user_id] = [] // Cria array vazio para armazenar sockets deste usuário
        }
        connectedUsers[user_id].push(socket.id); // Adiciona socket ID ao array do usuário (permite múltiplas conexões)
        console.log(`Usuário ${user_id} conectado no socket ${socket.id}`) // Loga conexão do usuário específico
    }

}) // Fecha listener de conexão WebSocket

app.get('/', (req, res) => { // Define rota GET para raiz da API
    return res.send('API AirCNC rodando...') // Retorna mensagem indicando que API está funcionando
}) // Fecha definição da rota raiz
// disponibilizar o connectedUsers para toda a aplicação, neste caso vamos usar um middleware
app.use((req, res, next) =>{ // Middleware global que executa em todas as requisições
    // como todas as rotas tem um req, significa que em cada rota eu consigo pegar o io que estará em req
    req.io = io; // Adiciona instância do Socket.IO ao objeto request para uso nas rotas
    // também vou deixar disponivel para todas as minhas rotas, os usuários conectados na minha aplicação
    req.connectedUsers = connectedUsers; // Adiciona objeto de usuários conectados ao request
    return next(); // Chama próximo middleware na cadeia (continua execução)
}) // Fecha middleware global

app.use(routes); // Registra todas as rotas importadas na aplicação Express
app.use('/files', express.static(path.resolve(__dirname, 'uploads'))) // Serve arquivos estáticos da pasta uploads na rota /files

app.get('/ping', (req, res) => { // Define rota GET para teste de conectividade
    console.log('recebeu ping'); // Loga que recebeu requisição de ping
    res.send('pong'); // Responde com 'pong' para confirmar que servidor está ativo
}) // Fecha definição da rota ping

async function startDatabase(){ // Função assíncrona para inicializar conexão com banco de dados
    const { DB_USER, DB_PASS, DB_NAME, DB_CLUSTER1, DB_CLUSTER2 } = process.env // Desestrutura variáveis de ambiente do banco
    const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@apijacinto.dizjg95.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=ApiJacinto`; // Monta string de conexão MongoDB Atlas
    //mongodb+srv://Alexsey:<db_password>@apijacinto.dizjg95.mongodb.net/?retryWrites=true&w=majority&appName=ApiJacinto
    try { // Bloco try para capturar erros de conexão
        await mongoose.connect(uri); // Conecta ao MongoDB usando a URI montada
        console.log('Conectado ao MongoDBAtlas'); // Loga sucesso na conexão
    } catch (error) { // Captura erros de conexão
        console.error('Erro ao conectar ao MongoDB: ', error.message); // Loga erro de conexão
        process.exit(1); // Encerra processo com código de erro se conexão falhar
    }
} // Fecha função de inicialização do banco

startDatabase().then( ()=> { // Executa função de conexão do banco e aguarda conclusão
    const port = process.env.PORT || 3335 // Define porta do servidor (variável de ambiente ou 3335 como padrão)
    server.listen(port, () =>{ // Inicia servidor HTTP na porta definida
        console.log(`Servidor rodando na porta ${port}`); // Loga que servidor está rodando e em qual porta
    }) // Fecha callback do listen
}) // Fecha then da inicialização



