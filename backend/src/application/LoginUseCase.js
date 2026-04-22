//#region UseCase Login - Application Layer
class LoginUseCase {
  //#region constructor - DI
  constructor(usuarioRepository, hashService, jwtService) {
    this.usuarioRepository = usuarioRepository; // Busca usuário
    this.hashService = hashService; // Compara hash
    this.jwtService = jwtService; // Gera token
  }
  //#endregion

  //#region execute - Login
  async execute(dados) {
    const { email, senha } = dados; // Destructuring object

    //#region Valida campos
    if (!email || !senha) throw new Error('Email e senha são obrigatórios'); // Truthy check
    //#endregion

    //#region Busca usuário
    const usuario = await this.usuarioRepository.buscarPorEmail(email); // SQL SELECT
    if (!usuario) throw new Error('Credenciais inválidas'); // Null check
    //#endregion

    //#region Compara senha
    const senhaValida = await this.hashService.compare(senha, usuario.senha); // bcrypt.compare
    if (!senhaValida) throw new Error('Credenciais inválidas'); // Boolean check
    //#endregion

    //#region Gera JWT
    const token = this.jwtService.sign({ id: usuario.id, email: usuario.email }); // Payload object
    //#endregion

    //#region Retorna token + user
    return { 
      token, 
      usuario: { 
        id: usuario.id, 
        nome: usuario.nome, 
        email: usuario.email, 
        endereco: usuario.endereco 
      } 
    };
    //#endregion
  }
  //#endregion
}

module.exports = LoginUseCase; // Export
//#endregion