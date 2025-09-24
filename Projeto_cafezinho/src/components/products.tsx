import { forwardRef } from "react"; // Importa forwardRef para encaminhar referências
import { log } from "@/utils/functions/logger"; // Logger padronizado

import {
  TouchableOpacity,
  TouchableOpacityProps,
  ImageProps,
  Image,
  View,
  Text,
  StyleSheet,
} from "react-native";

import { ProductProps as StaticProductProps } from "@/utils/data/products"; // Importa tipo de produto estático
import { Product as DynamicProduct } from "@/services/productsService"; // Importa tipo de produto dinâmico

type ProductDataProps = StaticProductProps | DynamicProduct | { // Tipo união para diferentes formatos de produto
  title: string; // Título do produto
  description: string | string[]; // Descrição como string ou array
  thumbnail: ImageProps | string; // Thumbnail como props de imagem ou string
  price?: number; // Preço opcional
  quantity?: number; // Quantidade opcional
};

type ProductProps = TouchableOpacityProps & { // Tipo que estende props do TouchableOpacity
  data: ProductDataProps; // Dados do produto
};

export const Product = forwardRef< // Componente Product com forwardRef
  React.ComponentRef<typeof TouchableOpacity>, // Tipo da referência
  ProductProps // Tipo das props
>(({ data, ...rest }, ref) => { // Desestrutura props e referência
  // Função para obter a fonte da imagem (compatível com ambos os formatos)
  const getImageSource = () => { // Função para determinar fonte da imagem
    if (typeof data.thumbnail === 'string') { // Se thumbnail é string (produto da API)
      // Para produtos dinâmicos, usar URL da API
      return { uri: (data as any).thumbnail_url || `http://10.53.52.27:3335/files/${data.thumbnail}` }; // Retorna objeto URI (IP da maquina)
    }
    // Para produtos estáticos, usar require
    return data.thumbnail as ImageProps['source']; // Retorna source do require
  };

  // Função para obter a descrição (compatível com ambos os formatos)
  const getDescription = () => { // Função para formatar descrição
    if (Array.isArray(data.description)) { // Se descrição é array
      return data.description.join(', '); // Junta elementos com vírgula
    }
    return data.description || ''; // Retorna string diretamente ou string vazia se undefined
  };

  // Função para obter o preço se disponível
  const getPrice = () => { // Função para formatar preço
    if ('price' in data && data.price) { // Se produto tem preço
      return `R$ ${data.price.toFixed(2)}`; // Formata preço com 2 casas decimais
    }
    return null; // Retorna null se não tem preço
  };

  return ( // Retorna JSX do componente
    <TouchableOpacity // Componente tocável principal
      ref={ref} // Encaminha referência
      {...rest} // Espalha demais props
      onPress={(e) => {
        try {
          const id = (data as any).id ?? (data as any)._id ?? undefined;
          log('ProductCard', 'onPress', { id, title: (data as any).title });
        } catch {}
        // Chama o onPress original (se houver)
        // @ts-ignore
        rest?.onPress?.(e);
      }}
    >
      {/* Envolve todo o conteúdo em uma única <View> para garantir que nenhum texto solto fique direto no Touchable */}
      <View className="w-full flex-row-reverse items-center pb-4">
        <Image source={getImageSource()} className="w-20 h-20 rounded-md" resizeMode="contain" /> {/* Imagem do produto (contain para manter proporcao) */}

        <View className="flex-1 ml-3"> {/* Container das informações */}
          <View className="flex-row items-center"> {/* Container do título e quantidade */}
            <Text className="text-white font-subtitle text-base flex-1"> {/* Título do produto */}
              {data.title || 'Produto sem nome'}
            </Text>

            {data.quantity && ( // Se produto tem quantidade (carrinho)
              <Text className="text-white font-subtitle text-sm"> {/* Texto da quantidade */}
                x {data.quantity || 0}
              </Text>
            )}
          </View>

          <Text className="text-slate-400 text-xs leading-5 mt-0.5"> {/* Descrição do produto */}
            {getDescription()}
          </Text>

          {getPrice() && ( // Se produto tem preço
            <Text className="text-lime-400 font-subtitle text-sm mt-1"> {/* Preço do produto */}
              {getPrice()}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});
