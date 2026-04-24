const HashService = require('./HashService');

describe('HashService', () => {
  let hashService;

  beforeEach(() => {
    hashService = new HashService();
  });

  describe('hash', () => {
    it('deve gerar hash diferente da senha original', async () => {
      const senha = 'minhaSenha123';
      const hash = await hashService.hash(senha);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(senha);
      expect(hash).toMatch(/^\$2[ayb]\$.{56}$/);
    });

    it('deve gerar hashes diferentes para mesma senha (salt único)', async () => {
      const senha = 'minhaSenha123';
      const hash1 = await hashService.hash(senha);
      const hash2 = await hashService.hash(senha);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('deve retornar true para senha correta', async () => {
      const senha = 'minhaSenha123';
      const hash = await hashService.hash(senha);

      const resultado = await hashService.compare(senha, hash);

      expect(resultado).toBe(true);
    });

    it('deve retornar false para senha incorreta', async () => {
      const senha = 'senhaCorreta';
      const hash = await hashService.hash(senha);

      const resultado = await hashService.compare('senhaIncorreta', hash);

      expect(resultado).toBe(false);
    });
  });
});