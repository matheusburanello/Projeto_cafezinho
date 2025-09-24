/** @type {import('tailwindcss').Config} */ // Comentário JSDoc para tipagem TypeScript do Tailwind
module.exports = { // Exporta configuração do Tailwind CSS
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"], // Define onde o Tailwind deve procurar classes CSS
  theme: { // Configurações do tema
    extend: { // Extensões ao tema padrão
      fontFamily: { // Definição de famílias de fontes customizadas
        heading: "Inter_600SemiBold", // Fonte para títulos (peso 600)
        subtitle: "Inter_500Medium", // Fonte para subtítulos (peso 500)
        body: "Inter_400Regular", // Fonte para corpo do texto (peso 400)
        bold: "Inter_700Bold" // Fonte para texto em negrito (peso 700)
      },
    },
  },
  plugins: [], // Array de plugins do Tailwind (vazio)
};
