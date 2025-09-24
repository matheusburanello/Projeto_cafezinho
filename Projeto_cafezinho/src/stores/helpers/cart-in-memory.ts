import { ProductProps } from "@/utils/data/products"; // Importa tipo de produto estático
import { Product } from "@/services/productsService"; // Importa tipo de produto dinâmico

import { CartProduct } from "../cart-store"; // Importa tipo de produto do carrinho

// Função helper para obter o ID do produto (compatível com ambos os formatos)
function getProductId(product: ProductProps | Product | CartProduct): string { // Função para extrair ID de qualquer tipo de produto
  return 'id' in product ? product.id : product._id; // Retorna 'id' se for produto estático ou '_id' se for da API
}

export function add(products: CartProduct[], newProduct: ProductProps | Product): CartProduct[] { // Função para adicionar produto ao carrinho
  const newProductId = getProductId(newProduct); // Obtém ID do produto a ser adicionado
  const existingProduct = products.find((product) => getProductId(product) === newProductId); // Busca se produto já existe no carrinho

  if (existingProduct) { // Se produto já existe no carrinho
    return products.map((product) => // Mapeia produtos do carrinho
      getProductId(product) === newProductId // Se é o produto que está sendo adicionado
        ? { ...product, quantity: product.quantity + 1 } // Incrementa quantidade em 1
        : product // Mantém produto inalterado
    );
  }

  return [...products, { ...newProduct, quantity: 1 } as CartProduct]; // Adiciona novo produto com quantidade 1
}

export function remove(products: CartProduct[], productRemoveId: string): CartProduct[] { // Função para remover produto do carrinho
  const updatedProducts = products.map((product) => // Mapeia produtos do carrinho
    getProductId(product) === productRemoveId // Se é o produto que está sendo removido
      ? { // Atualiza produto
          ...product, // Mantém propriedades existentes
          quantity: product.quantity > 1 ? product.quantity - 1 : 0, // Decrementa quantidade ou zera se for 1
        }
      : product // Mantém produto inalterado
  );

  return updatedProducts.filter((product) => product.quantity > 0); // Filtra apenas produtos com quantidade maior que 0
}
