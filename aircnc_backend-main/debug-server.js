const fs = require('fs');
const http = require('http');

// Escrever log em arquivo
fs.writeFileSync('server-log.txt', 'Iniciando servidor...\n');

const server = http.createServer((req, res) => {
    fs.appendFileSync('server-log.txt', `Requisição: ${req.url}\n`);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url === '/ping') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'pong' }));
    } else if (req.url === '/products') {
        const products = [
            {
                _id: "1",
                title: "Café Teste",
                description: ["Café para teste"],
                price: 5.00,
                category: "Drinks",
                available: true
            }
        ];
        res.writeHead(200);
        res.end(JSON.stringify(products));
    } else if (req.url === '/products/meta/categories') {
        res.writeHead(200);
        res.end(JSON.stringify(['Drinks']));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(3335, () => {
    fs.appendFileSync('server-log.txt', 'Servidor rodando na porta 3335\n');
});

server.on('error', (err) => {
    fs.appendFileSync('server-log.txt', `Erro: ${err.message}\n`);
});
