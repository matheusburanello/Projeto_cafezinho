// Pagina carrinho

import { View, Text, ScrollView, Alert, Linking } from "react-native"; // Importa componentes básicos do React Native
import { useEffect } from "react"; // Hook de efeito
import { log } from "@/utils/functions/logger"; // Logger padronizado

import { Header } from "@/components/header"; // Importa componente de cabeçalho

import { CartProduct, useCartStore } from "@/stores/cart-store"; // Importa tipo e store do carrinho
import { useOrders } from "@/hooks/useOrders"; // Importa hook para operações com pedidos

import { Product } from "@/components/products"; // Importa componente de produto

import { formatCurrency } from "@/utils/functions/format-currency"; // Importa função para formatar moeda

import { Input } from "@/components/input"; // Importa componente de input

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // Importa scroll view que evita teclado

import { Button } from "@/components/button"; // Importa componente de botão

import { Feather } from "@expo/vector-icons"; // Importa ícones Feather

import { LinkButton } from "@/components/link-button"; // Importa componente de botão com link

import { useState } from "react"; // Importa hook de estado do React

import { useNavigation } from "expo-router"; // Importa hook de navegação

const PHONE_NUMBER = "5519988414402"; // Constante com número do WhatsApp

export default function Cart() { // Componente principal da tela do carrinho
  const [address, setAddress] = useState(""); // Estado para endereço de entrega
  const [customerName, setCustomerName] = useState(""); // Estado para nome do cliente
  const [customerPhone, setCustomerPhone] = useState(""); // Estado para telefone do cliente
  const [useBackend, setUseBackend] = useState(false); // Estado para alternar entre backend e WhatsApp

  const cartStore = useCartStore(); // Obtém instância do store do carrinho
  const { createOrder, loading } = useOrders(); // Desestrutura função e estado do hook de pedidos
  const navigation = useNavigation(); // Obtém instância da navegação

  useEffect(() => {
    log('Cart', 'mounted', { items: cartStore.products.length });
  }, []);

  const total = formatCurrency(cartStore.getTotalPrice()); // Calcula e formata total do carrinho

  // Função para obter ID do produto (compatível com ambos os formatos)
  function getProductId(product: CartProduct): string { // Função para extrair ID do produto
    return 'id' in product ? product.id : product._id; // Retorna 'id' se for produto estático ou '_id' se for da API
  }

  function handleProductRemove(product: CartProduct) { // Função para remover produto do carrinho
    Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [ // Mostra alerta de confirmação
      { // Opção cancelar
        text: "Cancelar",
      },
      { // Opção remover
        text: "Remover",
        onPress: () => cartStore.remove(getProductId(product)), // Remove produto do carrinho
      },
    ]);
  }

  async function handleOrderBackend() { // Função assíncrona para criar pedido via backend
    if (!customerName.trim()) { // Valida se nome do cliente foi preenchido
      return Alert.alert("Atenção", "Nome do cliente é obrigatório!"); // Mostra alerta se nome vazio
    }

    if (cartStore.products.length === 0) { // Valida se carrinho não está vazio
      return Alert.alert("Atenção", "Carrinho está vazio!"); // Mostra alerta se carrinho vazio
    }

    try { // Bloco try para capturar erros
      const orderData = { // Objeto com dados do pedido
        user_id: "60d5ecb74f8a8b001f5e4e1a", // ID temporário do usuário (hardcoded)
        items: cartStore.products.map(product => ({ // Mapeia produtos do carrinho para formato da API
          product_id: getProductId(product), // ID do produto
          quantity: product.quantity // Quantidade do produto
        })),
        customerName: customerName.trim(), // Nome do cliente sem espaços extras
        customerPhone: customerPhone.trim() || undefined, // Telefone ou undefined se vazio
        notes: address.trim() || undefined // Observações ou undefined se vazio
      };

      const order = await createOrder(orderData); // Cria pedido via API

      if (order) { // Se pedido foi criado com sucesso
        Alert.alert( // Mostra alerta de sucesso
          "Pedido Criado!",
          `Seu pedido #${order.orderNumber} foi criado com sucesso!`,
          [ // Opções do alerta
            {
              text: "OK",
              onPress: () => { // Ao pressionar OK
                cartStore.clear(); // Limpa carrinho
                navigation.goBack(); // Volta para tela anterior
              }
            }
          ]
        );
      }
    } catch (error) { // Captura erros da criação do pedido
      Alert.alert("Erro", "Não foi possível criar o pedido. Tente novamente."); // Mostra alerta de erro
    }
  }

  function handleOrderWhatsApp() { // Função para enviar pedido via WhatsApp
    if (address.trim().length === 0) { // Valida se endereço foi preenchido
      return Alert.alert("Atenção", "Deve ser informado o endereço!"); // Mostra alerta se endereço vazio
    }

    const products = cartStore.products // Formata lista de produtos
      .map((product) => `\n ${product.quantity} ${product.title}`) // Mapeia cada produto para string
      .join(""); // Junta todos em uma string

    const message = ` // Template da mensagem do WhatsApp
    ☕ NOVO PEDIDO
    \n Entregar em ${address}

    ${products}

    \n Valor total: ${total}`;

    Linking.openURL( // Abre WhatsApp com mensagem pré-formatada
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
    );

    cartStore.clear(); // Limpa carrinho
    navigation.goBack(); // Volta para tela anterior
  }

  function handleOrder() { // Função para decidir qual método de pedido usar
    if (useBackend) { // Se deve usar backend
      handleOrderBackend(); // Chama função do backend
    } else { // Se deve usar WhatsApp
      handleOrderWhatsApp(); // Chama função do WhatsApp
    }
  }

  return ( // Retorna JSX da interface do carrinho
    <View className="flex-1 pt-8"> {/* Container principal */}
      <KeyboardAwareScrollView // ScrollView que evita sobreposição do teclado
        showsHorizontalScrollIndicator={false} // Oculta indicador de scroll horizontal
        extraHeight={100} // Altura extra para evitar teclado
      >
        <Header title="Seu Carrinho" /> {/* Cabeçalho da tela */}
        <ScrollView> {/* ScrollView interno para conteúdo */}
          <View className="p-5 flex-1"> {/* Container com padding */}
            {cartStore.products.length > 0 ? ( // Se há produtos no carrinho
              <View className="border-b border-slate-700"> {/* Container com borda inferior */}
                {cartStore.products.map((product) => ( // Mapeia produtos do carrinho
                  <Product // Componente de produto
                    key={getProductId(product)} // Chave única para React
                    data={product} // Dados do produto
                    onPress={() => handleProductRemove(product)} // Função ao pressionar (remover)
                  />
                ))}
              </View>
            ) : ( // Se carrinho está vazio
              <Text className="font-body text-white text-center my-8"> {/* Texto centralizado */}
                Seu carrinho está vazio
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4"> {/* Container do total */}
              <Text className="text-white text-xl font-subtitle">Total</Text> {/* Label do total */}
              <Text className="text-lime-400 text-2xl font-heading"> {/* Valor do total */}
                {total}
              </Text>
            </View>

            {useBackend ? ( // Se está usando backend
              <> {/* Fragment para múltiplos inputs */}
                <Input // Input para nome
                  placeholder="Nome completo" // Placeholder do input
                  onChangeText={setCustomerName} // Função ao mudar texto
                  value={customerName} // Valor atual
                  returnKeyType="next" // Tipo da tecla return
                />
                <Input // Input para telefone
                  placeholder="Telefone (opcional)" // Placeholder do input
                  onChangeText={setCustomerPhone} // Função ao mudar texto
                  value={customerPhone} // Valor atual
                  returnKeyType="next" // Tipo da tecla return
                />
                <Input // Input para observações
                  placeholder="Observações (endereço, etc.)" // Placeholder do input
                  onChangeText={setAddress} // Função ao mudar texto
                  value={address} // Valor atual
                  onSubmitEditing={handleOrder} // Função ao submeter
                  submitBehavior="blurAndSubmit" // Comportamento ao submeter
                  returnKeyType="send" // Tipo da tecla return
                />
              </>
            ) : ( // Se está usando WhatsApp
              <Input // Input único para endereço
                placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento" // Placeholder detalhado
                onChangeText={setAddress} // Função ao mudar texto
                value={address} // Valor atual
                onSubmitEditing={handleOrder} // Função ao submeter
                submitBehavior="blurAndSubmit" // Comportamento ao submeter
                returnKeyType="send" // Tipo da tecla return
              />
            )}

            <View className="flex-row items-center mt-4 mb-2"> {/* Container do toggle */}
              <Text className="text-white mr-3">Usar sistema de pedidos:</Text> {/* Label do toggle */}
              <Button // Botão para alternar modo
                onPress={() => setUseBackend(!useBackend)} // Inverte estado do backend
                className={`px-4 py-2 ${useBackend ? 'bg-lime-600' : 'bg-slate-600'}`} // Classes condicionais
              >
                <Button.Text>{useBackend ? 'SIM' : 'NÃO'}</Button.Text> {/* Texto do botão */}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5"> {/* Container dos botões inferiores */}
        <Button // Botão principal para enviar pedido
          onPress={handleOrder} // Função ao pressionar
          disabled={loading} // Desabilita se está carregando
          className={loading ? 'opacity-50' : ''} // Reduz opacidade se carregando
        >
          <Button.Text> {/* Texto do botão */}
            {loading ? 'Enviando...' : 'Enviar pedido'} {/* Texto condicional */}
          </Button.Text>
          <Button.Icon> {/* Ícone do botão */}
            <Feather name="arrow-right-circle" size={20} /> {/* Ícone de seta */}
          </Button.Icon>
        </Button>

        <LinkButton title="Voltar ao cardápio" href={"/"} /> {/* Botão para voltar */}
      </View>
    </View>
  );
}
