const mongoose = require('mongoose');// Importa biblioteca Mongoose para conexão com MongoDB
const Product = require('./models/Product');// Importa modelo Product para operações no banco
require('dotenv').config();

// Dados produtos 
const products = [
  {
    title: "Expresso Cappuccino",
    description: ["cappuccino"],
    price: 8.50,
    category: "Drinks",
    ingredients: ["Espresso", "Milk", "White Chocolate Syrup", "Caramel Drizzle"],
    available: true
  },
  {
    title: "Café Americano",
    description: ["café americano"],
    price: 6.00,
    category: "Drinks", 
    ingredients: ["Espresso", "Hot Water"],
    available: true
  }
];
// População do banco
async function seedProducts() {// Função assíncrona para popular banco com produtos
    // Bloco try para erros
    try {
        // Conectar ao banco de dados
    const { DB_USER, DB_PASS, DB_NAME } = process.env;// Conectar ao banco de dados
    const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@api.rmunb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=API`;// Monta string de conexão MongoDB Atlas
    
    await mongoose.connect(uri);// Conecta ao MongoDB usando a URI montada
    console.log('Conectado ao MongoDB');// Loga sucesso na conexão
    
    // Limpar produtos existentes
    await Product.deleteMany({});// Remove todos os produtos existentes da coleção
    await Product.insertMany(products);// Loga que produtos foram removidos
    
    console.log('Produtos inseridos com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

seedProducts();