import axios from 'axios'; // Importa biblioteca Axios para requisições HTTP
import { log, warn, error } from '@/utils/functions/logger'; // Logger padronizado

// Configuração base da API
const api = axios.create({ // Cria instância configurada do Axios
  baseURL: 'http://10.53.52.27:3335', // Define URL base do backend AirCNC (IP da máquina para emulador)
  timeout: 10000, // Define timeout de 10 segundos para requisições
  headers: { // Define headers padrão para todas as requisições
    'Content-Type': 'application/json', // Define tipo de conteúdo como JSON
  },
});

// Interceptor para adicionar token de autenticação e medir tempo
api.interceptors.request.use(
  (config) => {
    (config as any).metadata = { start: Date.now() };
    const { method, url, params } = config;
    log('API:request', method?.toUpperCase() + ' ' + url, { params, data: config.data });
    return config;
  },
  (err) => {
    error('API:request', 'config error', err);
    return Promise.reject(err);
  }
);

// Interceptor para tratar respostas e erros com tempo total
api.interceptors.response.use(
  (response) => {
    const meta = (response.config as any).metadata;
    const ms = meta?.start ? Date.now() - meta.start : undefined;
    log('API:response', response.config.method?.toUpperCase() + ' ' + response.config.url, { status: response.status, ms });
    return response;
  },
  (err) => {
    const cfg = err.config || {};
    const meta = (cfg as any).metadata;
    const ms = meta?.start ? Date.now() - meta.start : undefined;
    error('API:error', cfg?.method?.toUpperCase() + ' ' + cfg?.url, { ms, data: err.response?.data, message: err.message });
    return Promise.reject(err);
  }
);

export default api; // Exporta instância configurada do Axios
