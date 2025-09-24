import api from './api'; // Importa instância configurada do Axios

import { log, error as elog } from '@/utils/functions/logger'; // Logger padronizado

export interface Product { // Interface que define estrutura do produto da API
  _id: string; // ID único do produto no MongoDB
  title: string; // Nome/título do produto
  description: string[]; // Array de descrições do produto
  price: number; // Preço do produto
  category: string; // Categoria do produto (Drinks, Sweets, Savory)
  ingredients: string[]; // Array de ingredientes do produto
  cover: string; // Nome do arquivo da imagem de capa
  thumbnail: string; // Nome do arquivo da imagem miniatura
  cover_url: string; // URL completa da imagem de capa (campo virtual)
  thumbnail_url: string; // URL completa da imagem miniatura (campo virtual)
  available: boolean; // Indica se produto está disponível
  createdAt: string; // Data de criação do produto
  updatedAt: string; // Data da última atualização
}

export interface ProductsResponse { // Interface para resposta que contém produtos e categorias
  products: Product[]; // Array de produtos
  categories: string[]; // Array de categorias disponíveis
}

class ProductsService { // Classe de serviço para operações com produtos
  // Buscar todos os produtos
  async getProducts(category?: string, available?: boolean): Promise<Product[]> { // Método para buscar produtos com filtros opcionais
    try { // Bloco try para capturar erros
      const params: any = {}; // Objeto para parâmetros de query
      if (category) params.category = category; // Adiciona filtro de categoria se fornecido
      if (available !== undefined) params.available = available; // Adiciona filtro de disponibilidade se fornecido

      log('ProductsService','getProducts',{ params });
      const response = await api.get('/products', { params }); // Faz requisição GET para endpoint de produtos
      return response.data; // Retorna dados da resposta
    } catch (error) { // Captura erros da requisição
      elog('ProductsService','getProducts error', error);
      throw error; // Relança erro para quem chamou o método
    }
  }

  // Buscar produto por ID
  async getProductById(id: string): Promise<Product> { // Método para buscar produto específico por ID
    try { // Bloco try para capturar erros
      log('ProductsService','getProductById',{ id });
      const response = await api.get(`/products/${id}`); // Faz requisição GET para produto específico
      return response.data; // Retorna dados do produto
    } catch (error) { // Captura erros da requisição
      elog('ProductsService','getProductById error', error);
      throw error; // Relança erro para quem chamou o método
    }
  }

  // Buscar categorias disponíveis
  async getCategories(): Promise<string[]> { // Método para buscar lista de categorias
    try { // Bloco try para capturar erros
      log('ProductsService','getCategories');
      const response = await api.get('/products/meta/categories'); // Faz requisição GET para endpoint de categorias
      return response.data; // Retorna array de categorias
    } catch (error) { // Captura erros da requisição
      elog('ProductsService','getCategories error', error);
      throw error; // Relança erro para quem chamou o método
    }
  }

  // Buscar produtos por categoria
  async getProductsByCategory(category: string): Promise<Product[]> { // Método para buscar produtos de categoria específica
    try { // Bloco try para capturar erros
      return await this.getProducts(category, true); // Chama getProducts com filtro de categoria e disponibilidade
    } catch (error) { // Captura erros da requisição
      console.error('Erro ao buscar produtos por categoria:', error); // Loga erro no console
      throw error; // Relança erro para quem chamou o método
    }
  }

  // Buscar produtos disponíveis
  async getAvailableProducts(): Promise<Product[]> { // Método para buscar apenas produtos disponíveis
    try { // Bloco try para capturar erros
      log('ProductsService','getAvailableProducts');
      return await this.getProducts(undefined, true); // Chama getProducts sem filtro de categoria mas com disponibilidade true
    } catch (error) { // Captura erros da requisição
      elog('ProductsService','getAvailableProducts error', error);
      throw error; // Relança erro para quem chamou o método
    }
  }

  // Organizar produtos por categoria (similar ao MENU original)
  async getProductsGroupedByCategory(): Promise<{ title: string; data: Product[] }[]> { // Método para agrupar produtos por categoria
    try { // Bloco try para capturar erros
      log('ProductsService','getProductsGroupedByCategory');
      const products = await this.getAvailableProducts(); // Busca todos os produtos disponíveis
      const categories = await this.getCategories(); // Busca todas as categorias

      const groupedProducts = categories.map(category => ({ // Mapeia categorias para objeto com título e dados
        title: category, // Nome da categoria
        data: products.filter(product => product.category === category) // Filtra produtos desta categoria
      }));

      // Filtrar categorias que têm produtos
      return groupedProducts.filter(group => group.data.length > 0); // Retorna apenas categorias que têm produtos
    } catch (error) { // Captura erros da requisição
      console.error('Erro ao agrupar produtos por categoria:', error); // Loga erro no console
      throw error; // Relança erro para quem chamou o método
    }
  }
}

export default new ProductsService(); // Exporta instância única da classe (padrão Singleton)
