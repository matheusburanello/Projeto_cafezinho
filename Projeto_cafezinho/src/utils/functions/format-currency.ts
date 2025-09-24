export function formatCurrency(vaule: number) { // Função para formatar número como moeda brasileira
  return vaule.toLocaleString("pt-BR", { // Converte número para string formatada em português brasileiro
    style: "currency", // Define estilo como moeda
    currency: "BRL", // Define moeda como Real brasileiro
  });
}
