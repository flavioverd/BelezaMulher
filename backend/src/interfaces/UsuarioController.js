//#region Usuario Controller - Interface (Express)
class UsuarioController {
  //#region constructor - Injeção UseCases + Repository
  constructor(criarUsuarioUseCase, loginUseCase, usuarioRepository) {
    this.criarUsuarioUseCase = criarUsuarioUseCase; // UseCase criar
    this.loginUseCase = loginUseCase; // UseCase login
    this.usuarioRepository = usuarioRepository; // Repository
  }
  //#endregion

  //#region criarUsuario - POST /usuarios
  async criarUsuario(req, res) {
    try {
      const dadosUsuario = req.body; // req.body = JSON parsed (express.json())
      const usuarioCriado = await this.criarUsuarioUseCase.execute(dadosUsuario); // Await async
      res.status(201).json(usuarioCriado); // 201 = Created
    } 
    catch (error) { res.status(400).json({ erro: error.message }); } // 400 = Bad Request
  }
  //#endregion

  //#region login - POST /auth/login
  async login(req, res) {
    try {
      const dados = req.body; // {email, senha}
      const resultado = await this.loginUseCase.execute(dados); // Executa use case
      res.json(resultado); // 200 = OK (default)
    } 
    catch (error) { res.status(401).json({ erro: error.message }); } // 401 = Unauthorized
  }
  //#endregion

  //#region buscarUsuario - GET /usuarios/:id
  async buscarUsuario(req, res) {
    try {
      const { id } = req.params; // req.params = URL parameters (/:id)
      const usuario = await this.usuarioRepository.buscarPorId(id); // Repository call
      if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' }); // 404 = Not Found
      res.json(usuario); // 200
    } 
    catch (error) { res.status(500).json({ erro: error.message }); } // 500 = Internal Server Error
  }
  //#endregion

  //#region atualizarUsuario - PUT /usuarios/:id
  async atualizarUsuario(req, res) {
    try {
      const { id } = req.params; // URL param
      const { nome, endereco } = req.body; // Body fields
      const usuarioExistente = await this.usuarioRepository.buscarPorId(id); // Verifica existência
      if (!usuarioExistente) return res.status(404).json({ erro: 'Usuário não encontrado' }); // Null check
      const usuarioAtualizado = await this.usuarioRepository.atualizar(id, { nome, endereco }); // Update
      res.json(usuarioAtualizado); // 200
    } 
    catch (error) { res.status(500).json({ erro: error.message }); }
  }
  //#endregion
}

module.exports = UsuarioController; // Export
//#endregion