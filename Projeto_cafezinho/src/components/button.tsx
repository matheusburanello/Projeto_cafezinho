import React, { ReactNode } from "react"; // Importa React para usar React.Children
import { TouchableOpacity, TouchableOpacityProps, Text, View } from "react-native"; // Importa componentes do React Native
import { log } from "@/utils/functions/logger"; // Logger padronizado

type ButtonProps = TouchableOpacityProps & { // Define tipo que estende props do TouchableOpacity
  children: ReactNode; // Elementos filhos do botão
};

type ButtonTextProps = { // Define tipo para componente de texto do botão
  children: ReactNode; // Conteúdo de texto
};

type ButtonIconProps = { // Define tipo para componente de ícone do botão
  children: ReactNode; // Elemento de ícone
};

function Button({ children, onPress, ...rest }: ButtonProps) { // Componente principal do botão
  const isTextChild = typeof children === 'string' || typeof children === 'number'; // Verifica se filho é texto/numero

  const handlePress: TouchableOpacityProps['onPress'] = (e) => {
    log('Button', 'press');
    onPress?.(e as any);
  };

  const content = isTextChild ? (
    <Text className="text-black font-heading text-base mx-2">{children as any}</Text>
  ) : (
    // Remove nós de texto soltos (espaços/\n) para evitar o warning em RN
    (React.Children.toArray(children).filter(
      (child) => typeof child !== 'string' && typeof child !== 'number'
    ) as any)
  );

  return ( // Retorna JSX do botão
    <TouchableOpacity // Componente tocável
      className={ // Classes de estilo
        "h-12 bg-[#f5deb3] rounded-md items-center justify-center flex-row" // Cor bege, bordas arredondadas, layout flexível
      }
      activeOpacity={0.7} // Opacidade quando pressionado
      onPress={handlePress}
      {...rest} // Espalha demais props
    >
      {/* TouchableOpacity precisa de UM único filho React Element */}
      <View className="flex-row items-center justify-center">
        {content}
      </View>
    </TouchableOpacity>
  );
}

function ButtonText({ children }: ButtonTextProps) { // Subcomponente para texto do botão
  return ( // Retorna JSX do texto
    <Text className="text-black font-heading text-base mx-2">{children}</Text> // Texto preto com margem horizontal
  );
}

function ButtonIcon({ children }: ButtonIconProps) { // Subcomponente para ícone do botão
  return children; // Retorna elemento filho diretamente
}

Button.Text = ButtonText; // Anexa subcomponente Text ao Button
Button.Icon = ButtonIcon; // Anexa subcomponente Icon ao Button

export { Button }; // Exporta componente Button
