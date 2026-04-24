const request = require('supertest');
const app = require('../../index');

describe('API Integration Tests', () => {
  describe('GET /health', () => {
    it('deve retornar status OK', async () => {
      const resposta = await request(app).get('/health');

      expect(resposta.status).toBe(200);
      expect(resposta.body).toHaveProperty('status', 'OK');
      expect(resposta.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /auth/login', () => {
    it('deve retornar erro com credenciais vazias', async () => {
      const resposta = await request(app)
        .post('/auth/login')
        .send({ email: '', senha: '' });

      expect(resposta.status).toBe(400);
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      const resposta = await request(app)
        .post('/auth/login')
        .send({ email: 'naoexiste@teste.com', senha: 'senha123' });

      expect(resposta.status).toBe(401);
    });
  });

  describe('POST /usuarios', () => {
    it('deve criar usuário com dados válidos', async () => {
      const resposta = await request(app)
        .post('/usuarios')
        .send({
          nome: 'Joana Silva',
          email: `joana${Date.now()}@teste.com`,
          senha: 'senha123',
          endereco: 'Rua B, 456'
        });

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
      expect(resposta.body).toHaveProperty('nome');
    });

    it('deve retornar erro com dados inválidos', async () => {
      const resposta = await request(app)
        .post('/usuarios')
        .send({ nome: 'A', email: 'invalido', senha: '123' });

      expect(resposta.status).toBe(400);
    });
  });

  describe('GET /produtos', () => {
    it('deve listar produtos', async () => {
      const resposta = await request(app).get('/produtos');

      expect(resposta.status).toBe(200);
      expect(Array.isArray(resposta.body)).toBe(true);
    });
  });

  describe('GET /produtos/:id', () => {
    it('deve retornar erro para produto inexistente', async () => {
      const resposta = await request(app).get('/produtos/999999');

      expect(resposta.status).toBe(404);
    });
  });
});