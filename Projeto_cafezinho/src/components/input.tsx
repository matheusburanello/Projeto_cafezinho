import { TextInput, TextInputProps } from "react-native"; // Importa componente e tipos de input de texto

export function Input({ ...rest }: TextInputProps) { // Componente de input customizado
  return ( // Retorna JSX do input
    <TextInput // Componente de entrada de texto
      multiline // Permite múltiplas linhas
      textAlignVertical="top" // Alinha texto no topo (para multiline)
      placeholderTextColor="#94a3b8" // Cor do placeholder (cinza claro)
      className="h-32 bg-slate-800 rounded-md px-4 py-3 font-body text-sm text-white" // Classes de estilo
      {...rest} // Espalha demais props recebidas
    />
  );
}
