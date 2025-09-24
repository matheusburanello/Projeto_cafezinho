const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

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
        cover_url: "http://localhost:3335/files/Coffe_1.png",
        thumbnail_url: "http://localhost:3335/files/Coffe1.png",
        available: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

app.get('/', (req, res) => {
    res.json({ message: 'API funcionando' });
});

app.get('/products', (req, res) => {
    res.json(mockProducts);
});

app.get('/products/meta/categories', (req, res) => {
    res.json(['Drinks']);
});

app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

const port = 3335;
app.listen(port, '0.0.0.0', () => {
    console.log('Servidor rodando na porta', port);
    console.log('Acesse em: http://10.53.52.27:3335');
});
