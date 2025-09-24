import { Image, Text, View, ActivityIndicator } from "react-native"; // Importa componentes básicos do React Native

import { useLocalSearchParams, useNavigation, Redirect } from "expo-router"; // Importa hooks e componentes do Expo Router

import { PRODUCTS } from "@/utils/data/products"; // Importa produtos estáticos
import { useProducts } from "@/hooks/useProducts"; // Importa hook de produtos
import productsService from "@/services/productsService"; // Importa serviço de produtos

import { formatCurrency } from "@/utils/functions/format-currency"; // Importa função de formatação de moeda

import { Button } from "@/components/button"; // Importa componente de botão

import { Feather } from "@expo/vector-icons"; // Importa ícones Feather

import { LinkButton } from "@/components/link-button"; // Importa componente de botão com link
import { log, warn, error } from "@/utils/functions/logger"; // Logger padronizado

import { useCartStore } from "@/stores/cart-store"; // Importa store do carrinho

import { useState, useEffect } from "react"; // Importa hooks do React

export default function Product() { // Componente da página de detalhes do produto
  const cartStore = useCartStore(); // Obtém instância do store do carrinho
  const navigation = useNavigation(); // Obtém instância da navegação
  const { id } = useLocalSearchParams(); // Obtém ID do produto dos parâmetros da URL
  const { products } = useProducts(); // Obtém produtos do hook

  const [product, setProduct] = useState(null); // Estado para armazenar produto atual
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado de erro

  useEffect(() => { // Hook de efeito para carregar produto
    log('ProductScreen', 'mount', { id });

    async function loadProduct() { // Função assíncrona para carregar produto
      try { // Bloco try para capturar erros
        setLoading(true); // Define loading como true

        // Primeiro tentar buscar nos produtos estáticos
        const staticProduct = PRODUCTS.find((item) => item.id === id); // Busca produto nos dados estáticos
        if (staticProduct) { // Se encontrou produto estático
          log('ProductScreen', 'found static product', { id });
          setProduct(staticProduct); // Define produto encontrado
          setLoading(false); // Para o loading
          return; // Sai da função
        }

        // Se não encontrar, tentar buscar nos produtos dinâmicos
        const dynamicProduct = products.find((item) => item._id === id); // Busca produto nos dados dinâmicos
        if (dynamicProduct) { // Se encontrou produto dinâmico
          log('ProductScreen', 'found dynamic product', { id });
          setProduct(dynamicProduct); // Define produto encontrado
          setLoading(false); // Para o loading
          return; // Sai da função
        }

        // Se ainda não encontrar, tentar buscar diretamente da API
        if (typeof id === 'string' && id.length === 24) { // Verifica se ID é ObjectId do MongoDB
          log('ProductScreen', 'fetch product by id from API', { id });
          const apiProduct = await productsService.getProductById(id); // Busca produto na API
          setProduct(apiProduct); // Define produto da API
        } else { // Se ID não é válido
          warn('ProductScreen', 'invalid id format', { id });
          setError('Produto não encontrado'); // Define erro
        }
      } catch (err) { // Captura erros
        error('ProductScreen', 'loadProduct failed', err); // Loga erro no console
        setError('Erro ao carregar produto'); // Define mensagem de erro
      } finally { // Bloco finally sempre executa
        setLoading(false); // Para o loading
      }
    }

    if (id) { // Se há ID do produto
      loadProduct(); // Carrega produto
    }
  }, [id, products]); // Dependências do useEffect

  function handleAddToCart() { // Função para adicionar produto ao carrinho
    log('ProductScreen', 'add to cart pressed', { id });
    if (product) { // Se há produto
      cartStore.add(product); // Adiciona produto ao carrinho
      navigation.goBack(); // Volta para tela anterior
    }
  }

  if (loading) { // Se está carregando
    return ( // Retorna tela de loading
      <View className="flex-1 justify-center items-center"> {/* Container centralizado */}
        <ActivityIndicator size="large" color="#C47F17" /> {/* Indicador de carregamento */}
        <Text className="text-white mt-4">Carregando produto...</Text> {/* Texto de carregamento */}
      </View>
    );
  }

  if (error || !product) { // Se há erro ou não há produto
    return <Redirect href={"/"} />; // Redireciona para home
  }

  // Função para obter a fonte da imagem de capa
  const getCoverSource = () => { // Função para determinar fonte da imagem de capa
    if (typeof product.cover === 'string') { // Se capa é string (produto da API)
      // Para produtos dinâmicos, usar URL da API
      return { uri: product.cover_url || `http://10.53.52.27:3335/files/${product.cover}` }; // Retorna objeto URI (IP da maquina)
    }
    // Para produtos estáticos, usar require
    return product.cover; // Retorna source do require
  };

  // Função para obter a descrição
  const getDescription = () => { // Função para formatar descrição
    if (Array.isArray(product.description)) { // Se descrição é array
      return product.description.join(', '); // Junta elementos com vírgula
    }
    return product.description || ''; // Retorna string diretamente ou string vazia se undefined
  };

  // Função para obter o preço
  const getPrice = () => { // Função para formatar preço
    if ('price' in product && product.price) { // Se produto tem preço
      return formatCurrency(product.price); // Formata preço como moeda
    }
    return null; // Retorna null se não tem preço
  };

  return ( // Retorna JSX da tela de produto
    <View className="flex-1"> {/* Container principal */}
      <Image // Imagem de capa do produto
        source={getCoverSource()} // Fonte da imagem (estática ou dinâmica)
        className="w-full h-52" // Largura total e altura fixa
        resizeMode="cover" // Modo de redimensionamento
      />

      <View className="p-5 mt-8 flex-1"> {/* Container do conteúdo com padding */}
        <View className="flex-row justify-between items-start mb-2"> {/* Header com título e preço */}
          <Text className="text-white text-xl font-heading flex-1">{product.title || 'Produto sem nome'}</Text> {/* Título do produto */}
          {getPrice() && ( // Se há preço
            <Text className="text-lime-400 text-xl font-heading">{getPrice()}</Text> // Preço formatado
          )}
        </View>

        <Text className="text-slate-400 font-body text-base leading-6 mb-6"> {/* Descrição do produto */}
          {getDescription()} {/* Descrição formatada */}
        </Text>

        {product.ingredients && product.ingredients.length > 0 && ( // Se há ingredientes
          <> {/* Fragment para agrupar elementos */}
            <Text className="text-white font-heading text-lg mb-3">Ingredientes:</Text> {/* Título da seção */}
            {product.ingredients.map((ingredient, index) => ( // Mapeia ingredientes
              <Text // Texto de cada ingrediente
                key={`${ingredient || 'ingredient'}-${index}`} // Chave única
                className="text-slate-300 font-body text-base leading-6" // Estilos do texto
              >
                {"\u2022"} {ingredient || 'Ingrediente'} {/* Bullet point e nome do ingrediente */}
              </Text>
            ))}
          </>
        )}
      </View>

      <View className="p-5 pb-8 gap-5 items-center"> {/* Container dos botões */}
        <Button onPress={handleAddToCart} className="w-[90%] self-center"> {/* Botão de adicionar ao carrinho */}
          <Button.Icon> {/* Ícone do botão */}
            <Feather name="plus-circle" size={20} /> {/* Ícone de adicionar */}
          </Button.Icon>
          <Button.Text>Adicionar ao pedido</Button.Text> {/* Texto do botão */}
        </Button>

        <LinkButton title="Voltar ao cardápio" href={"/"} /> {/* Botão para voltar */}
      </View>
    </View>
  );
} // Fim do componente
