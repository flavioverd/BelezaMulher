const JwtService = require('./JwtService');

describe('JwtService', () => {
  let jwtService;
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
    jwtService = new JwtService();
  });

  afterEach(() => {
    if (originalSecret) {
      process.env.JWT_SECRET = originalSecret;
    } else {
      delete process.env.JWT_SECRET;
    }
  });

  describe('sign', () => {
    it('deve gerar token JWT válido', () => {
      const payload = { id: 1, email: 'teste@teste.com' };
      const token = jwtService.sign(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verify', () => {
    it('deve verificar token válido e retornar payload', () => {
      const payload = { id: 1, email: 'teste@teste.com' };
      const token = jwtService.sign(payload);

      const resultado = jwtService.verify(token);

      expect(resultado.id).toBe(1);
      expect(resultado.email).toBe('teste@teste.com');
    });

    it('deve lançar erro para token inválido', () => {
      const token = 'token.invalido';

      expect(() => jwtService.verify(token)).toThrow();
    });

    it('deve lançar erro para token com secret diferente', () => {
      const payload = { id: 1 };
      const token = jwtService.sign(payload);

      const jwtService2 = new JwtService();
      jwtService2.secret = 'outro-secret';

      expect(() => jwtService2.verify(token)).toThrow();
    });
  });
});