import { useState, useEffect } from 'react'; // Importa hooks do React para estado e efeitos
import productsService, { Product } from '@/services/productsService'; // Importa serviço e interface de produtos
import { log, error as elog } from '@/utils/functions/logger'; // Logger padronizado

interface UseProductsReturn { // Interface que define o retorno do hook
  products: Product[]; // Array de todos os produtos
  categories: string[]; // Array de categorias disponíveis
  menu: { title: string; data: Product[] }[]; // Menu agrupado por categorias
  loading: boolean; // Estado de carregamento
  error: string | null; // Mensagem de erro ou null
  refreshProducts: () => Promise<void>; // Função para recarregar produtos
  getProductsByCategory: (category: string) => Product[]; // Função para filtrar produtos por categoria
}

export function useProducts(): UseProductsReturn { // Hook customizado para gerenciar produtos
  const [products, setProducts] = useState<Product[]>([]); // Estado para armazenar todos os produtos
  const [categories, setCategories] = useState<string[]>([]); // Estado para armazenar categorias
  const [menu, setMenu] = useState<{ title: string; data: Product[] }[]>([]); // Estado para menu agrupado
  const [loading, setLoading] = useState(true); // Estado de carregamento (inicia como true)
  const [error, setError] = useState<string | null>(null); // Estado para mensagens de erro

  const loadProducts = async () => { // Função assíncrona para carregar produtos da API
    try { // Bloco try para capturar erros
      setLoading(true); // Define loading como true no início
      setError(null); // Limpa erros anteriores
      log('useProducts','load start');

      // Carregar produtos e categorias em paralelo
      const [productsData, categoriesData, menuData] = await Promise.all([ // Executa requisições em paralelo
        productsService.getAvailableProducts(), // Busca produtos disponíveis
        productsService.getCategories(), // Busca categorias
        productsService.getProductsGroupedByCategory() // Busca produtos agrupados por categoria
      ]);

      log('useProducts','load success',{ products: productsData.length, categories: categoriesData.length, sections: menuData.length });
      setProducts(productsData); // Atualiza estado com produtos carregados
      setCategories(categoriesData); // Atualiza estado com categorias carregadas
      setMenu(menuData); // Atualiza estado com menu agrupado
    } catch (err) { // Captura erros das requisições
      elog('useProducts','load error', err); // Loga erro
      setError('Erro ao carregar produtos. Tente novamente.'); // Define mensagem de erro amigável

      // Fallback para dados estáticos em caso de erro
      setProducts([]); // Define produtos como array vazio
      setCategories(['Drinks']); // Define categoria padrão
      setMenu([]); // Define menu como array vazio
    } finally { // Bloco finally sempre executa
      setLoading(false); // Define loading como false ao final
      log('useProducts','load end');
    }
  };

  const refreshProducts = async () => { // Função para recarregar produtos
    await loadProducts(); // Chama função de carregamento
  };

  const getProductsByCategory = (category: string): Product[] => { // Função para filtrar produtos por categoria
    return products.filter(product => product.category === category); // Filtra produtos da categoria especificada
  };

  useEffect(() => { // Hook de efeito que executa após montagem do componente
    loadProducts(); // Carrega produtos na inicialização
  }, []); // Array vazio significa que executa apenas uma vez

  return { // Retorna objeto com todos os valores e funções do hook
    products, // Array de produtos
    categories, // Array de categorias
    menu, // Menu agrupado
    loading, // Estado de carregamento
    error, // Mensagem de erro
    refreshProducts, // Função para recarregar
    getProductsByCategory // Função para filtrar por categoria
  };
}
