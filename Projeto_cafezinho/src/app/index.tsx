import { View, Text, FlatList, SectionList, ActivityIndicator, StyleSheet } from "react-native";
import { Header } from "@/components/header"; // Importa componente de cabeçalho personalizado
import { CategoryButton } from "@/components/category-button"; // Importa componente de botão de categoria

import { CATEGORIES, MENU, ProductProps } from "@/utils/data/products"; // Importa dados estáticos e tipos
import { useProducts } from "@/hooks/useProducts"; // Importa hook customizado para produtos
import { Product as ProductType } from "@/services/productsService"; // Importa tipo de produto da API

import { Product } from "@/components/products"; // Importa componente de produto

import { useState, useRef, useEffect } from "react"; // Importa hooks do React

import { useRouter } from "expo-router"; // Hook para navegação imperativa

import { useCartStore } from "@/stores/cart-store"; // Importa store do carrinho
import { log } from "@/utils/functions/logger"; // Logger padronizado

export default function Home() { // Componente principal da tela inicial
  const cartStore = useCartStore(); // Obtém instância do store do carrinho
  const { products, categories, menu, loading, error, refreshProducts } = useProducts(); // Desestrutura dados do hook de produtos

  const router = useRouter(); // Navegador imperativo para evitar problemas com <Link asChild>

  // Usar categorias dinâmicas ou fallback para estáticas
  const availableCategories = categories.length > 0 ? categories : CATEGORIES; // Usa categorias da API ou estáticas como fallback
  const availableMenu = menu.length > 0 ? menu : MENU; // Usa menu da API ou estático como fallback

  const [category, setCategory] = useState(availableCategories[0] || CATEGORIES[0]); // Estado para categoria selecionada (primeira por padrão)

  const sectionListRef = useRef<SectionList<ProductProps | ProductType>>(null); // Referência para controlar scroll da lista

  const cartQuantityItems = cartStore.getTotalItems(); // Obtém quantidade total de itens no carrinho

  useEffect(() => {
    log('Home', 'mounted', { products: products.length, categories: availableCategories.length, menuSections: availableMenu.length });
  }, []);

  // Atualizar categoria quando as categorias dinâmicas carregarem
  useEffect(() => { // Hook de efeito para atualizar categoria quando dados carregarem
    if (availableCategories.length > 0 && !availableCategories.includes(category)) { // Verifica se categoria atual é válida
      setCategory(availableCategories[0]); // Define primeira categoria como padrão
    }
  }, [availableCategories]); // Executa quando availableCategories mudar

  function handleCategorySelect(selectedCategory: string) { // Função para lidar com seleção de categoria
    setCategory(selectedCategory); // Atualiza categoria selecionada

    const sectionIndex = availableCategories.findIndex( // Encontra índice da categoria selecionada
      (cat) => cat === selectedCategory
    );

    if (sectionListRef.current) { // Verifica se referência da lista existe
      sectionListRef.current.scrollToLocation({ // Rola para seção correspondente
        animated: true, // Com animação
        sectionIndex, // Índice da seção
        itemIndex: 0, // Primeiro item da seção
      });
    }
  }

  // Função para obter ID do produto (compatível com ambos os formatos)
  function getProductId(item: ProductProps | ProductType): string { // Função para extrair ID do produto
    return 'id' in item ? item.id : item._id; // Retorna 'id' se for produto estático ou '_id' se for da API
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C47F17" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Header title="Faça um pedido" cartQuantityItem={cartQuantityItems} />
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={refreshProducts}>
            Tentar novamente
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Faça um pedido" cartQuantityItem={cartQuantityItems} />

      <FlatList
        data={availableCategories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item || 'Categoria'}
            isSelected={item === category}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        horizontal
        style={styles.categoryList}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
      />

      <SectionList
        ref={sectionListRef}
        sections={availableMenu}
        keyExtractor={(item) => getProductId(item)}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Product
            data={item}
            onPress={() => {
              const pid = getProductId(item);
              log('Home', 'press product', { id: pid, title: (item as any).title });
              router.push(`/product/${pid}`);
            }}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>
            {title || 'Categoria'}
          </Text>
        )}
        style={styles.productList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
  },
  loadingContainer: {
    flex: 1,
    paddingTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    paddingTop: 32,
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#f87171',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryText: {
    color: '#fb923c',
    textDecorationLine: 'underline',
  },
  categoryList: {
    maxHeight: 40,
    marginTop: 20,
  },
  productList: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 32,
    marginBottom: 12,
  },
});
