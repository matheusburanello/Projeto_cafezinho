import { Link } from "expo-router"; // Importa componente de link do Expo Router
import { Text } from "react-native"; // Importa Text para evitar string direta em componentes pressables
import { log } from "@/utils/functions/logger"; // Logger padronizado

import type { ComponentProps } from "react"; // Importa tipo para extrair props de componente

type LinkButtonProps = ComponentProps<typeof Link> & { // Define tipo que estende props do Link
  title: string; // Título do link
};

export function LinkButton({ title, ...rest }: LinkButtonProps) { // Componente de botão que funciona como link
  return ( // Retorna JSX do link
    <Link {...rest} asChild onPress={() => log('LinkButton', 'press', { title })}> {/* Usa asChild e Text para garantir que texto esteja dentro de <Text> */}
      <Text className="text-slate-300 text-center text-base font-body">{title || 'Link'}</Text>
    </Link>
  );
}
