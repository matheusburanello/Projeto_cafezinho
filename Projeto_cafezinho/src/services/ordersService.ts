import api from './api'; // Importa instância configurada do Axios
import { Product } from './productsService'; // Importa interface Product do serviço de produtos

export interface OrderItem { // Interface que define estrutura de um item do pedido
  product: string | Product; // Produto pode ser ID (string) ou objeto Product completo
  quantity: number; // Quantidade do produto no pedido
  price: number; // Preço unitário do produto no momento do pedido
}

export interface Order { // Interface que define estrutura completa do pedido
  _id: string; // ID único do pedido no MongoDB
  user: string; // ID do usuário que fez o pedido
  items: OrderItem[]; // Array de itens do pedido
  totalAmount: number; // Valor total do pedido
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'; // Status atual do pedido
  customerName: string; // Nome do cliente
  customerPhone?: string; // Telefone do cliente (opcional)
  notes?: string; // Observações do pedido (opcional)
  orderNumber: string; // Número único do pedido gerado automaticamente
  createdAt: string; // Data de criação do pedido
  updatedAt: string; // Data da última atualização
}

export interface CreateOrderData { // Interface para dados necessários para criar pedido
  user_id: string; // ID do usuário que está fazendo o pedido
  items: { // Array de itens simplificado para criação
    product_id: string; // ID do produto
    quantity: number; // Quantidade desejada
  }[];
  customerName: string; // Nome do cliente
  customerPhone?: string; // Telefone do cliente (opcional)
  notes?: string; // Observações do pedido (opcional)
}

export interface OrderStats { // Interface para estatísticas de pedidos
  byStatus: { // Estatísticas agrupadas por status
    _id: string; // Status do pedido
    count: number; // Quantidade de pedidos neste status
    totalAmount: number; // Valor total dos pedidos neste status
  }[];
  totalOrders: number; // Total geral de pedidos
  totalRevenue: number; // Receita total de pedidos entregues
}

class OrdersService { // Classe de serviço para operações com pedidos
  // Criar novo pedido
  async createOrder(orderData: CreateOrderData): Promise<Order> { // Método para criar novo pedido
    try { // Bloco try para capturar erros
      const response = await api.post('/orders', orderData); // Faz requisição POST para criar pedido
      return response.data; // Retorna dados do pedido criado
    } catch (error) { // Captura erros da requisição
      console.error('Erro ao criar pedido:', error); // Loga erro no console
      throw error; // Relança erro para quem chamou o método
    }
  }

  // Buscar pedidos (com filtros opcionais)
  async getOrders(status?: string, userId?: string, limit?: number): Promise<Order[]> { // Método para buscar pedidos com filtros
    try { // Bloco try para capturar erros
      const params: any = {}; // Objeto para parâmetros de query
      if (status) params.status = status; // Adiciona filtro de status se fornecido
      if (userId) params.user_id = userId; // Adiciona filtro de usuário se fornecido
      if (limit) params.limit = limit; // Adiciona limite de resultados se fornecido

      const response = await api.get('/orders', { params }); // Faz requisição GET com parâmetros
      return response.data; // Retorna array de pedidos
    } catch (error) { // Captura erros da requisição
      console.error('Erro ao buscar pedidos:', error); // Loga erro no console
      throw error; // Relança erro para quem chamou o método
    }
  }

  // Buscar pedido por ID
  async getOrderById(id: string): Promise<Order> { // Método para buscar pedido específico por ID
    try { // Bloco try para capturar erros
      const response = await api.get(`/orders/${id}`); // Faz requisição GET para pedido específico
      return response.data; // Retorna dados do pedido
    } catch (error) { // Captura erros da requisição
      console.error('Erro ao buscar pedido:', error); // Loga erro no console
      throw error; // Relança erro para quem chamou o método
    }
  }

  // Buscar pedidos de um usuário específico
  async getUserOrders(userId: string, status?: string, limit?: number): Promise<Order[]> { // Método para buscar pedidos de usuário
    try { // Bloco try para capturar erros
      const params: any = {}; // Objeto para parâmetros de query
      if (status) params.status = status; // Adiciona filtro de status se fornecido
      if (limit) params.limit = limit; // Adiciona limite de resultados se fornecido

      const response = await api.get(`/orders/user/${userId}`, { params }); // Faz requisição GET para pedidos do usuário
      return response.data; // Retorna array de pedidos do usuário
    } catch (error) { // Captura erros da requisição
      console.error('Erro ao buscar pedidos do usuário:', error); // Loga erro no console
      throw error; // Relança erro para quem chamou o método
    }
  }

  // Atualizar status do pedido
  async updateOrderStatus(orderId: string, status: string): Promise<Order> { // Método para atualizar status do pedido
    try { // Bloco try para capturar erros
      const response = await api.put(`/orders/${orderId}/status`, { status }); // Faz requisição PUT para atualizar status
      return response.data; // Retorna pedido atualizado
    } catch (error) { // Captura erros da requisição
      console.error('Erro ao atualizar status do pedido:', error); // Loga erro no console
      throw error; // Relança erro para quem chamou o método
    }
  }

  // Buscar estatísticas de pedidos
  async getOrderStats(): Promise<OrderStats> { // Método para buscar estatísticas de pedidos
    try { // Bloco try para capturar erros
      const response = await api.get('/orders/meta/stats'); // Faz requisição GET para endpoint de estatísticas
      return response.data; // Retorna objeto com estatísticas
    } catch (error) { // Captura erros da requisição
      console.error('Erro ao buscar estatísticas:', error); // Loga erro no console
      throw error; // Relança erro para quem chamou o método
    }
  }

  // Cancelar pedido
  async cancelOrder(orderId: string): Promise<Order> { // Método para cancelar pedido
    try { // Bloco try para capturar erros
      return await this.updateOrderStatus(orderId, 'cancelled'); // Chama updateOrderStatus com status 'cancelled'
    } catch (error) { // Captura erros da requisição
      console.error('Erro ao cancelar pedido:', error); // Loga erro no console
      throw error; // Relança erro para quem chamou o método
    }
  }

  // Confirmar pedido
  async confirmOrder(orderId: string): Promise<Order> { // Método para confirmar pedido
    try { // Bloco try para capturar erros
      return await this.updateOrderStatus(orderId, 'confirmed'); // Chama updateOrderStatus com status 'confirmed'
    } catch (error) { // Captura erros da requisição
      console.error('Erro ao confirmar pedido:', error); // Loga erro no console
      throw error; // Relança erro para quem chamou o método
    }
  }
}

export default new OrdersService(); // Exporta instância única da classe (padrão Singleton)
