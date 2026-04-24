//#region Pedido Controller - Interface (Express)
const Pedido = require('../domain/Pedido'); // Import Entity

class PedidoController {
  //#region constructor - Injeção Repositories
  constructor(pedidoRepository, produtoRepository) {
    this.pedidoRepository = pedidoRepository; // Repository Pedido
    this.produtoRepository = produtoRepository; // Repository Produto (para validação)
  }
  //#endregion

  //#region criar - POST /pedidos
  async criar(req, res) {
    try {
      const { usuarioId, itens } = req.body; // Destructuring body
      if (!usuarioId || !itens || itens.length === 0) return res.status(400).json({ erro: 'Usuário e itens são obrigatórios' }); // Validação

      let total = 0; // Acumulador
      const itensValidados = []; // Array

      //#region Loop valida cada item
      for (const item of itens) { // for...of itera array
        const produto = await this.produtoRepository.buscarPorId(item.produtoId); // Busca produto
        if (!produto) return res.status(400).json({ erro: `Produto ${item.produtoId} não encontrado` }); // 400
        if (produto.estoque < item.quantidade) return res.status(400).json({ erro: `Estoque insuficiente para ${produto.nome}` }); // Validação estoque
        total += produto.preco * item.quantidade; // Acumula total
        itensValidados.push({ // Push objeto
          produtoId: produto.id, 
          quantidade: item.quantidade, 
          precoUnitario: produto.preco 
        });
      }
      //#endregion

      const pedido = new Pedido(null, usuarioId, new Date(), 'pendente', total, itensValidados); // Entity
      const pedidoSalvo = await this.pedidoRepository.criar(pedido); // Repository create (transação)
      res.status(201).json(pedidoSalvo); // 201
    } 
    catch (error) { res.status(500).json({ erro: error.message }); }
  }
  //#endregion

  //#region buscarPorId - GET /pedidos/:id
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const pedido = await this.pedidoRepository.buscarPorId(id); // Repository com JOIN itens
      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' }); // 404
      res.json(pedido); // 200
    } 
    catch (error) { res.status(500).json({ erro: error.message }); }
  }
  //#endregion

  //#region buscarPorUsuario - GET /pedidos/usuario/:usuarioId
  async buscarPorUsuario(req, res) {
    try {
      const { usuarioId } = req.params; // URL param
      const pedidos = await this.pedidoRepository.buscarPorUsuario(usuarioId); // Repository find
      res.json(pedidos); // 200 = array
    } 
    catch (error) { res.status(500).json({ erro: error.message }); }
  }
  //#endregion

  //#region listar - GET /pedidos (admin)
  async listar(req, res) {
    try {
      const pedidos = await this.pedidoRepository.buscarTodos(); // Repository all
      res.json(pedidos); // 200
    } 
    catch (error) { res.status(500).json({ erro: error.message }); }
  }
  //#endregion

  //#region atualizarStatus - PATCH /pedidos/:id/status
  async atualizarStatus(req, res) {
    try {
      const { id } = req.params; // URL param
      const { status } = req.body; // Body field
      const statusValidos = ['pendente', 'pago', 'enviado', 'entregue', 'cancelado']; // Array whitelist
      if (!statusValidos.includes(status)) return res.status(400).json({ erro: 'Status inválido' }); // Validação
      const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(id, status); // Repository update
      if (!pedidoAtualizado) return res.status(404).json({ erro: 'Pedido não encontrado' }); // 404
      res.json(pedidoAtualizado); // 200
    } 
    catch (error) { res.status(500).json({ erro: error.message }); }
  }
  //#endregion
}

module.exports = PedidoController; // Export
//#endregion