const LoginUseCase = require('./LoginUseCase');

describe('LoginUseCase', () => {
  let loginUseCase;
  let mockUsuarioRepository;
  let mockHashService;
  let mockJwtService;

  beforeEach(() => {
    mockUsuarioRepository = {
      buscarPorEmail: jest.fn()
    };
    mockHashService = {
      compare: jest.fn()
    };
    mockJwtService = {
      sign: jest.fn()
    };
    loginUseCase = new LoginUseCase(mockUsuarioRepository, mockHashService, mockJwtService);
  });

  describe('execute', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const dados = {
        email: 'maria@teste.com',
        senha: 'senha123'
      };

      mockUsuarioRepository.buscarPorEmail.mockResolvedValue({
        id: 1,
        nome: 'Maria Silva',
        email: 'maria@teste.com',
        senha: 'hashValido',
        endereco: 'Rua A, 123'
      });
      mockHashService.compare.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('token.jwt.foo');

      const resultado = await loginUseCase.execute(dados);

      expect(resultado).toHaveProperty('token');
      expect(resultado).toHaveProperty('usuario');
      expect(resultado.usuario.nome).toBe('Maria Silva');
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: 1, email: 'maria@teste.com' });
    });

    it('deve lançar erro quando email não existe', async () => {
      const dados = {
        email: 'naoexiste@teste.com',
        senha: 'senha123'
      };

      mockUsuarioRepository.buscarPorEmail.mockResolvedValue(null);

      await expect(loginUseCase.execute(dados))
        .rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar erro quando senha incorreta', async () => {
      const dados = {
        email: 'maria@teste.com',
        senha: 'senhaErrada'
      };

      mockUsuarioRepository.buscarPorEmail.mockResolvedValue({
        id: 1,
        nome: 'Maria Silva',
        email: 'maria@teste.com',
        senha: 'hashValido'
      });
      mockHashService.compare.mockResolvedValue(false);

      await expect(loginUseCase.execute(dados))
        .rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar erro quando email vazio', async () => {
      const dados = {
        email: '',
        senha: 'senha123'
      };

      await expect(loginUseCase.execute(dados))
        .rejects.toThrow('Email e senha são obrigatórios');
    });

    it('deve lançar erro quando senha vazia', async () => {
      const dados = {
        email: 'maria@teste.com',
        senha: ''
      };

      await expect(loginUseCase.execute(dados))
        .rejects.toThrow('Email e senha são obrigatórios');
    });
  });
});