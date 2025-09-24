const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    //Nome Produto
  title: {
    type: String,
    required: true
  },
  //Valor produto
  description: [String],
  //Preco produto
  price: {
    type: Number,
    required: true
  },
  category: {
    //Categoria produto
    type: String,
    required: true
  },
  //Ingrediante produto
  ingredients: [String],
  cover: String,
  thumbnail: String,
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
// Exporta modelo Product baseado no schema criado
module.exports = mongoose.model('Product', ProductSchema);