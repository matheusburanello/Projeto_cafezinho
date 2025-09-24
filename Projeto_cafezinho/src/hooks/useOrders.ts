import { useState } from 'react'; // Importa hook de estado do React
import ordersService, { Order, CreateOrderData } from '@/services/ordersService'; // Importa serviço e tipos de pedidos

interface UseOrdersReturn { // Interface que define o retorno do hook
  orders: Order[]; // Array de pedidos
  loading: boolean; // Estado de carregamento
  error: string | null; // Mensagem de erro ou null
  createOrder: (orderData: CreateOrderData) => Promise<Order | null>; // Função para criar pedido
  getUserOrders: (userId: string) => Promise<Order[]>; // Função para buscar pedidos do usuário
  updateOrderStatus: (orderId: string, status: string) => Promise<Order | null>; // Função para atualizar status
  refreshOrders: () => Promise<void>; // Função para recarregar pedidos
}

export function useOrders(): UseOrdersReturn { // Hook customizado para gerenciar pedidos
  const [orders, setOrders] = useState<Order[]>([]); // Estado para armazenar pedidos
  const [loading, setLoading] = useState(false); // Estado de carregamento (inicia como false)
  const [error, setError] = useState<string | null>(null); // Estado para mensagens de erro

  const createOrder = async (orderData: CreateOrderData): Promise<Order | null> => { // Função assíncrona para criar pedido
    try { // Bloco try para capturar erros
      setLoading(true); // Define loading como true no início
      setError(null); // Limpa erros anteriores

      const newOrder = await ordersService.createOrder(orderData); // Cria pedido via API

      // Adicionar o novo pedido à lista local
      setOrders(prevOrders => [newOrder, ...prevOrders]); // Adiciona novo pedido no início da lista

      return newOrder; // Retorna pedido criado
    } catch (err: any) { // Captura erros da criação
      console.error('Erro ao criar pedido:', err); // Loga erro no console
      setError(err.response?.data?.error || 'Erro ao criar pedido. Tente novamente.'); // Define mensagem de erro
      return null; // Retorna null em caso de erro
    } finally { // Bloco finally sempre executa
      setLoading(false); // Define loading como false ao final
    }
  };

  const getUserOrders = async (userId: string): Promise<Order[]> => { // Função para buscar pedidos do usuário
    try { // Bloco try para capturar erros
      setLoading(true); // Define loading como true no início
      setError(null); // Limpa erros anteriores

      const userOrders = await ordersService.getUserOrders(userId); // Busca pedidos do usuário via API
      setOrders(userOrders); // Atualiza estado com pedidos do usuário

      return userOrders; // Retorna pedidos encontrados
    } catch (err: any) { // Captura erros da busca
      console.error('Erro ao buscar pedidos do usuário:', err); // Loga erro no console
      setError(err.response?.data?.error || 'Erro ao buscar pedidos. Tente novamente.'); // Define mensagem de erro
      return []; // Retorna array vazio em caso de erro
    } finally { // Bloco finally sempre executa
      setLoading(false); // Define loading como false ao final
    }
  };

  const updateOrderStatus = async (orderId: string, status: string): Promise<Order | null> => { // Função para atualizar status
    try { // Bloco try para capturar erros
      setLoading(true); // Define loading como true no início
      setError(null); // Limpa erros anteriores

      const updatedOrder = await ordersService.updateOrderStatus(orderId, status); // Atualiza status via API

      // Atualizar o pedido na lista local
      setOrders(prevOrders => // Atualiza estado dos pedidos
        prevOrders.map(order => // Mapeia pedidos existentes
          order._id === orderId ? updatedOrder : order // Substitui pedido atualizado ou mantém original
        )
      );

      return updatedOrder; // Retorna pedido atualizado
    } catch (err: any) { // Captura erros da atualização
      console.error('Erro ao atualizar status do pedido:', err); // Loga erro no console
      setError(err.response?.data?.error || 'Erro ao atualizar pedido. Tente novamente.'); // Define mensagem de erro
      return null; // Retorna null em caso de erro
    } finally { // Bloco finally sempre executa
      setLoading(false); // Define loading como false ao final
    }
  };

  const refreshOrders = async (): Promise<void> => { // Função para recarregar todos os pedidos
    try { // Bloco try para capturar erros
      setLoading(true); // Define loading como true no início
      setError(null); // Limpa erros anteriores

      const allOrders = await ordersService.getOrders(); // Busca todos os pedidos via API
      setOrders(allOrders); // Atualiza estado com todos os pedidos
    } catch (err: any) { // Captura erros da busca
      console.error('Erro ao atualizar pedidos:', err); // Loga erro no console
      setError(err.response?.data?.error || 'Erro ao atualizar pedidos. Tente novamente.'); // Define mensagem de erro
    } finally { // Bloco finally sempre executa
      setLoading(false); // Define loading como false ao final
    }
  };

  return { // Retorna objeto com todos os valores e funções do hook
    orders, // Array de pedidos
    loading, // Estado de carregamento
    error, // Mensagem de erro
    createOrder, // Função para criar pedido
    getUserOrders, // Função para buscar pedidos do usuário
    updateOrderStatus, // Função para atualizar status
    refreshOrders // Função para recarregar pedidos
  };
}
