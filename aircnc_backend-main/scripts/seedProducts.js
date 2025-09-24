require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const mongoose = require('mongoose'); // Importa biblioteca Mongoose para conexão com MongoDB
const Product = require('../models/Products'); // Importa modelo Product para operações no banco

// Dados dos produtos baseados no frontend
const productsData = [ // Array com dados dos produtos para popular o banco
    { // Primeiro produto: Expresso Cappuccino
        title: "Expresso Cappuccino", // Nome do produto
        description: ["cappuccino"], // Array com descrição do produto
        price: 8.50, // Preço do produto em reais
        category: "Drinks", // Categoria do produto (bebidas)
        ingredients: ["Espresso", "Milk", "White Chocolate Syrup", "Caramel Drizzle"], // Lista de ingredientes
        cover: "Coffe_1.png", // Nome do arquivo da imagem de capa
        thumbnail: "Coffe1.png", // Nome do arquivo da imagem miniatura
        available: true // Indica se produto está disponível para venda
    },
    { // Segundo produto: Expresso Latte
        title: "Expresso Latte", // Nome do produto
        description: ["Café cremoso com leite vaporizado"], // Array com descrição do produto
        price: 7.50, // Preço do produto em reais
        category: "Drinks", // Categoria do produto (bebidas)
        ingredients: ["Leite vaporizado", "Combinado com uma fina camada final de espuma de leite por cima"], // Lista de ingredientes
        cover: "Coffe_2.png", // Nome do arquivo da imagem de capa
        thumbnail: "Coffe2.png", // Nome do arquivo da imagem miniatura
        available: true // Indica se produto está disponível para venda
    },
    { // Terceiro produto: Expresso Americano
        title: "Expresso Americano", // Nome do produto
        description: ["Café americano tradicional"], // Array com descrição do produto
        price: 6.00, // Preço do produto em reais
        category: "Drinks", // Categoria do produto (bebidas)
        ingredients: ["Agua", "Cafe expresso"], // Lista de ingredientes
        cover: "Coffe_3.png", // Nome do arquivo da imagem de capa
        thumbnail: "Coffe3.png", // Nome do arquivo da imagem miniatura
        available: true // Indica se produto está disponível para venda
    },
    { // Quarto produto: Expresso Mocha
        title: "Expresso Mocha", // Nome do produto
        description: ["Café com chocolate"], // Array com descrição do produto
        price: 9.00, // Preço do produto em reais
        category: "Drinks", // Categoria do produto (bebidas)
        ingredients: ["Agua", "Leite vaporizado", "Caramelo"], // Lista de ingredientes
        cover: "Coffe_4.png", // Nome do arquivo da imagem de capa
        thumbnail: "Coffe4.png", // Nome do arquivo da imagem miniatura
        available: true // Indica se produto está disponível para venda
    }
];

async function seedProducts() { // Função assíncrona para popular banco com produtos
    try { // Bloco try para capturar erros
        // Conectar ao banco de dados
        const { DB_USER, DB_PASS, DB_NAME } = process.env; // Conectar ao banco de dados
        const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@api.rmunb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=API`; // Monta string de conexão MongoDB Atlas

        await mongoose.connect(uri); // Conecta ao MongoDB usando a URI montada
        console.log('Conectado ao MongoDB Atlas'); // Loga sucesso na conexão

        // Limpar produtos existentes (opcional)
        await Product.deleteMany({}); // Remove todos os produtos existentes da coleção
        console.log('Produtos existentes removidos'); // Loga que produtos foram removidos

        // Inserir novos produtos
        const products = await Product.insertMany(productsData); // Insere todos os produtos do array no banco
        console.log(`${products.length} produtos inseridos com sucesso:`); // Loga quantidade de produtos inseridos

        products.forEach(product => { // Itera sobre produtos inseridos
            console.log(`- ${product.title} (R$ ${product.price.toFixed(2)})`); // Loga nome e preço de cada produto
        });

    } catch (error) { // Captura erros de execução
        console.error('Erro ao popular produtos:', error); // Loga erro no console
    } finally { // Bloco finally sempre executa
        await mongoose.disconnect(); // Desconecta do MongoDB
        console.log('Desconectado do MongoDB'); // Loga que desconectou
    }
}

// Executar o script se for chamado diretamente
if (require.main === module) { // Verifica se arquivo está sendo executado diretamente
    seedProducts(); // Executa função de seed
}

module.exports = seedProducts; // Exporta função para uso em outros arquivos
