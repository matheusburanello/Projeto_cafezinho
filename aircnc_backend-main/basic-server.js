const http = require('http');
const url = require('url');

const mockProducts = [
    {
        _id: "60d5ecb74f8a8b001f5e4e1a",
        title: "Expresso Cappuccino",
        description: ["cappuccino"],
        price: 8.50,
        category: "Drinks",
        ingredients: ["Espresso", "Milk", "White Chocolate Syrup", "Caramel Drizzle"],
        cover: "Coffe_1.png",
        thumbnail: "Coffe1.png",
        cover_url: "http://10.53.52.27:3335/files/Coffe_1.png",
        thumbnail_url: "http://10.53.52.27:3335/files/Coffe1.png",
        available: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "60d5ecb74f8a8b001f5e4e1b",
        title: "Expresso Latte",
        description: ["Café cremoso com leite vaporizado"],
        price: 7.50,
        category: "Drinks",
        ingredients: ["Leite vaporizado", "Combinado com uma fina camada final de espuma de leite por cima"],
        cover: "Coffe_2.png",
        thumbnail: "Coffe2.png",
        cover_url: "http://10.53.52.27:3335/files/Coffe_2.png",
        thumbnail_url: "http://10.53.52.27:3335/files/Coffe2.png",
        available: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (path === '/') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'API funcionando' }));
    } else if (path === '/products') {
        res.writeHead(200);
        res.end(JSON.stringify(mockProducts));
    } else if (path === '/products/meta/categories') {
        res.writeHead(200);
        res.end(JSON.stringify(['Drinks']));
    } else if (path === '/ping') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'pong' }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

const port = 3335;
server.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Acesse em: http://10.53.52.27:${port}`);
});
