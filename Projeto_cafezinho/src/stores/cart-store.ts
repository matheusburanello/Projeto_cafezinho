import { create } from "zustand"; // Importa função create da biblioteca Zustand para gerenciamento de estado

import { ProductProps } from "@/utils/data/products"; // Importa tipo de produto estático
import { Product } from "@/services/productsService"; // Importa tipo de produto dinâmico da API

import * as cartInMemory from "./helpers/cart-in-memory"; // Importa funções helper para manipulação do carrinho em memória

import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage para persistência local

import { createJSONStorage, persist } from "zustand/middleware"; // Importa middlewares do Zustand para persistência

// Tipo compatível com ambos os formatos (estático e dinâmico)
export type CartProduct = (ProductProps | Product) & { // Define tipo que aceita produto estático ou dinâmico
  quantity: number; // Adiciona propriedade quantity ao produto
};

type StateProps = { // Define interface do estado do carrinho
  products: CartProduct[]; // Array de produtos no carrinho
  add: (product: ProductProps | Product) => void; // Função para adicionar produto
  remove: (productId: string) => void; // Função para remover produto por ID
  clear: () => void; // Função para limpar carrinho
  getTotalPrice: () => number; // Função para calcular preço total
  getTotalItems: () => number; // Função para contar total de itens
};

export const useCartStore = create( // Cria store do Zustand
  persist<StateProps>( // Aplica middleware de persistência
    (set, get) => ({ // Função que define estado e ações
      products: [], // Estado inicial: array vazio de produtos

      add: (product: ProductProps | Product) => // Ação para adicionar produto ao carrinho
        set((state) => ({ // Atualiza estado
          products: cartInMemory.add(state.products, product), // Usa helper para adicionar produto
        })),

      remove: (productId: string) => // Ação para remover produto do carrinho
        set((state) => ({ // Atualiza estado
          products: cartInMemory.remove(state.products, productId), // Usa helper para remover produto
        })),

      clear: () => set(() => ({ products: [] })), // Ação para limpar carrinho (reseta para array vazio)

      getTotalPrice: () => { // Função para calcular preço total do carrinho
        const { products } = get(); // Obtém produtos do estado atual
        return products.reduce((total, product) => { // Reduz array para somar preços
          const price = 'price' in product ? product.price : 0; // Verifica se produto tem preço
          return total + (price * product.quantity); // Soma preço multiplicado pela quantidade
        }, 0); // Valor inicial da soma é 0
      },

      getTotalItems: () => { // Função para contar total de itens no carrinho
        const { products } = get(); // Obtém produtos do estado atual
        return products.reduce((total, product) => total + product.quantity, 0); // Soma todas as quantidades
      },
    }),
    { // Configurações do middleware de persistência
      name: "cafe:cart", // Nome da chave no AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Configura AsyncStorage como storage
    }
  )
);
