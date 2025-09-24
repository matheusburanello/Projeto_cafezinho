// Logger util simples para padronizar logs em toda a aplicação
// Use: log('Home', 'Mensagem', dados)
//      warn('Home', 'Aviso', dados)
//      error('Home', 'Erro', dados)

export function log(scope: string, ...args: any[]) {
  // Prefixo com escopo/tela e timestamp curto
  const ts = new Date().toISOString().split('T')[1].replace('Z', '');
  // eslint-disable-next-line no-console
  console.log(`[${ts}] [${scope}]`, ...args);
}

export function warn(scope: string, ...args: any[]) {
  const ts = new Date().toISOString().split('T')[1].replace('Z', '');
  // eslint-disable-next-line no-console
  console.warn(`[${ts}] [${scope}]`, ...args);
}

export function error(scope: string, ...args: any[]) {
  const ts = new Date().toISOString().split('T')[1].replace('Z', '');
  // eslint-disable-next-line no-console
  console.error(`[${ts}] [${scope}]`, ...args);
}

