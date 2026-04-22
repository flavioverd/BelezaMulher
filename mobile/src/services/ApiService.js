import axios from 'axios'; // Importa axios

const API_URL = 'http://10.0.2.2:3000'; // URL da API (emulator android)

class ApiService {
  constructor() {
    // Cria instância do axios com config base
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    this.token = null;
  }

  // Define token de autenticação
  setToken(token) {
    this.token = token;
    if (token) {
      // Adiciona token ao header padrão
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // Remove token do header
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Método genérico para requisições
  async request(method, endpoint, data = null) {
    try {
      const config = { method, url: endpoint };
      if (data) config.data = data;
      const response = await this.api(config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro na requisição');
    }
  }

  // Login
  async login(email, senha) {
    const data = await this.request('POST', '/auth/login', { email, senha });
    this.setToken(data.token);
    return data;
  }

  // Registrar usuário
  async registrar(dados) {
    return this.request('POST', '/usuarios', dados);
  }

  // Buscar produtos com filtros
  async buscarProdutos(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    return this.request('GET', `/produtos?${params}`);
  }

  // Buscar produto por ID
  async buscarProdutoPorId(id) {
    return this.request('GET', `/produtos/${id}`);
  }

  // Criar pedido
  async criarPedido(usuarioId, itens) {
    return this.request('POST', '/pedidos', { usuarioId, itens });
  }

  // Buscar pedidos por usuário
  async buscarPedidosPorUsuario(usuarioId) {
    return this.request('GET', `/pedidos/usuario/${usuarioId}`);
  }
}

export default new ApiService(); // Exporta instância singleton