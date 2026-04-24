const CriarUsuarioUseCase = require('./CriarUsuarioUseCase');

describe('CriarUsuarioUseCase', () => {
  let criarUsuarioUseCase;
  let mockUsuarioRepository;
  let mockHashService;

  beforeEach(() => {
    mockUsuarioRepository = {
      buscarPorEmail: jest.fn(),
      salvar: jest.fn()
    };
    mockHashService = {
      hash: jest.fn()
    };
    criarUsuarioUseCase = new CriarUsuarioUseCase(mockUsuarioRepository, mockHashService);
  });

  describe('execute', () => {
    it('deve criar usuário com dados válidos', async () => {
      const dadosUsuario = {
        nome: 'Maria Silva',
        email: 'maria@teste.com',
        senha: 'senha123',
        endereco: 'Rua A, 123'
      };

      mockUsuarioRepository.buscarPorEmail.mockResolvedValue(null);
      mockUsuarioRepository.salvar.mockResolvedValue({
        id: 1,
        nome: 'Maria Silva',
        email: 'maria@teste.com',
        senha: 'hash123',
        endereco: 'Rua A, 123',
        dataCadastro: new Date()
      });
      mockHashService.hash.mockResolvedValue('hash123');

      const resultado = await criarUsuarioUseCase.execute(dadosUsuario);

      expect(resultado).toHaveProperty('id');
      expect(resultado.nome).toBe('Maria Silva');
      expect(resultado.email).toBe('maria@teste.com');
      expect(mockUsuarioRepository.buscarPorEmail).toHaveBeenCalledWith('maria@teste.com');
      expect(mockUsuarioRepository.salvar).toHaveBeenCalled();
    });

    it('deve lançar erro quando email já existe', async () => {
      const dadosUsuario = {
        nome: 'Maria Silva',
        email: 'existente@teste.com',
        senha: 'senha123',
        endereco: 'Rua A, 123'
      };

      mockUsuarioRepository.buscarPorEmail.mockResolvedValue({
        id: 1,
        email: 'existente@teste.com'
      });

      await expect(criarUsuarioUseCase.execute(dadosUsuario))
        .rejects.toThrow('Email já cadastrado');
    });

    it('deve lançar erro com nome muito curto', async () => {
      const dadosUsuario = {
        nome: 'M',
        email: 'teste@teste.com',
        senha: 'senha123',
        endereco: 'Rua A'
      };

      await expect(criarUsuarioUseCase.execute(dadosUsuario))
        .rejects.toThrow('Nome deve ter pelo menos 2 caracteres');
    });

    it('deve lançar erro com email inválido', async () => {
      const dadosUsuario = {
        nome: 'Maria Silva',
        email: 'email-invalido',
        senha: 'senha123',
        endereco: 'Rua A'
      };

      await expect(criarUsuarioUseCase.execute(dadosUsuario))
        .rejects.toThrow('Email inválido');
    });

    it('deve lançar erro com senha muito curta', async () => {
      const dadosUsuario = {
        nome: 'Maria Silva',
        email: 'teste@teste.com',
        senha: '12345',
        endereco: 'Rua A'
      };

      await expect(criarUsuarioUseCase.execute(dadosUsuario))
        .rejects.toThrow('Senha deve ter pelo menos 6 caracteres');
    });
  });
});