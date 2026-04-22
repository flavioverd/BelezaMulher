//#region UseCase CriarUsuario - Application Layer
class CriarUsuarioUseCase {
  //#region constructor - Injeção de dependências
  constructor(usuarioRepository, hashService) {
    this.usuarioRepository = usuarioRepository; // Repository pattern
    this.hashService = hashService; // Service de hash
  }
  //#endregion

  //#region execute - Ponto de entrada principal
  async execute(dadosUsuario) {
    this.validarDados(dadosUsuario); // Valida entrada

    //#region Verifica email duplicado
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(dadosUsuario.email); // Await promise
    if (usuarioExistente) throw new Error('Email já cadastrado'); // Throw Error
    //#endregion

    //#region Hash de senha
    const senhaHash = await this.hashService.hash(dadosUsuario.senha); // Async hash
    //#endregion

    //#region Cria entidade
    const novoUsuario = new (require('../domain/Usuario'))( // Require dinâmico
      null, // ID null (banco gera)
      dadosUsuario.nome, 
      dadosUsuario.email, 
      senhaHash, // Senha hasheada
      dadosUsuario.endereco
    );
    //#endregion

    //#region Persiste no banco
    const usuarioSalvo = await this.usuarioRepository.salvar(novoUsuario); // Salva
    //#endregion

    //#region Retorna DTO (sem senha)
    return { 
      id: usuarioSalvo.id, 
      nome: usuarioSalvo.nome, 
      email: usuarioSalvo.email, 
      endereco: usuarioSalvo.endereco, 
      dataCadastro: usuarioSalvo.dataCadastro 
    };
    //#endregion
  }
  //#endregion

  //#region validarDados - Validação de entrada
  validarDados(dados) {
    if (!dados.nome || dados.nome.trim().length < 2) throw new Error('Nome deve ter pelo menos 2 caracteres'); // trim() remove espaços
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex padrão email
    if (!dados.email || !emailRegex.test(dados.email)) throw new Error('Email inválido'); // test() executa regex
    if (!dados.senha || dados.senha.length < 6) throw new Error('Senha deve ter pelo menos 6 caracteres'); // length propriedade
  }
  //#endregion
}

module.exports = CriarUsuarioUseCase; // Export default
//#endregion