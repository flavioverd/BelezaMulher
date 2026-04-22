//#region Produto Controller - Interface (Express)
const Produto = require('../domain/Produto'); // Import Entity

class ProdutoController {
  //#region constructor - Injeção Repository
  constructor(produtoRepository) {
    this.produtoRepository = produtoRepository;
  }
  //#endregion

  //#region criar - POST /produtos
  async criar(req, res) {
    try {
      const { nome, descricao, preco, tamanho, cor, imagemUrl, estoque } = req.body; // Destructuring body
      if (!nome || !preco) return res.status(400).json({ erro: 'Nome e preço são obrigatórios' }); // Validação básica
      const produto = new Produto(null, nome, descricao, preco, tamanho, cor, imagemUrl, estoque); // Instancia Entity
      const produtoSalvo = await this.produtoRepository.salvar(produto); // Repository save
      res.status(201).json(produtoSalvo); // 201 Created
    } 
    catch (error) { res.status(500).json({ erro: error.message }); }
  }
  //#endregion

  //#region listar - GET /produtos (com filtros query string)
  async listar(req, res) {
    try {
      const filtros = { // Objeto filtros
        nome: req.query.nome, // query string: ?nome=...
        tamanho: req.query.tamanho, // ?tamanho=P
        cor: req.query.cor, // ?cor=Azul
        precoMin: req.query.precoMin ? parseFloat(req.query.precoMin) : undefined, // parseFloat: string->number
        precoMax: req.query.precoMax ? parseFloat(req.query.precoMax) : undefined
      };
      const produtos = await this.produtoRepository.buscarTodos(filtros); // Repository com filtros
      res.json(produtos); // 200 = array JSON
    } 
    catch (error) { res.status(500).json({ erro: error.message }); }
  }
  //#endregion

  //#region buscarPorId - GET /produtos/:id
  async buscarPorId(req, res) {
    try {
      const { id } = req.params; // Param URL
      const produto = await this.produtoRepository.buscarPorId(id); // Repository find
      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' }); // 404
      res.json(produto); // 200
    } 
    catch (error) { res.status(500).json({ erro: error.message }); }
  }
  //#endregion

  //#region atualizar - PUT /produtos/:id
  async atualizar(req, res) {
    try {
      const { id } = req.params; // URL param
      const { nome, descricao, preco, tamanho, cor, imagemUrl, estoque } = req.body; // Body
      const produto = new Produto(id, nome, descricao, preco, tamanho, cor, imagemUrl, estoque); // Entity com ID
      const produtoAtualizado = await this.produtoRepository.atualizar(id, produto); // Repository update
      if (!produtoAtualizado) return res.status(404).json({ erro: 'Produto não encontrado' }); // Null check
      res.json(produtoAtualizado); // 200
    } 
    catch (error) { res.status(500).json({ erro: error.message }); }
  }
  //#endregion

  //#region deletar - DELETE /produtos/:id
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await this.produtoRepository.deletar(id); // Repository delete
      if (!deletado) return res.status(404).json({ erro: 'Produto não encontrado' }); // 404
      res.status(204).send(); // 204 = No Content (resposta vazia)
    } 
    catch (error) { res.status(500).json({ erro: error.message }); }
  }
  //#endregion
}

module.exports = ProdutoController; // Export
//#endregion