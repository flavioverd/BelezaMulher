//#region Entity Pedido - Domínio
class Pedido {
  constructor(id, usuarioId, dataPedido, status, total, itens = []) {
    this.id = id; // ID único
    this.usuarioId = usuarioId; // FK usuário
    this.dataPedido = dataPedido || new Date(); // Data, default now
    this.status = status || 'pendente'; // Status, default pendente
    this.total = total || 0; // Total, default 0
    this.itens = itens; // Array de itens (vazio default)
  }

  //#region adicionarItem - Adiciona produto ao pedido
  adicionarItem(produto, quantidade) {
    const item = { // Objeto literal
      produtoId: produto.id, // ID do produto
      nome: produto.nome, // Nome (cache)
      preco: produto.preco, // Preço unitário
      quantidade: quantidade, // Qty solicitada
      subtotal: produto.preco * quantidade // preço * qty
    };
    this.itens.push(item); // Push adiciona ao array
    this.calcularTotal(); // Chama método interno
  }
  //#endregion

  //#region calcularTotal - Soma subtotais
  calcularTotal() { 
    // reduce: accumulator + current, arrow function
    this.total = this.itens.reduce((soma, item) => soma + item.subtotal, 0); 
  }
  //#endregion

  //#region alterarStatus - Modifica status
  alterarStatus(novoStatus) {
    const statusValidos = ['pendente', 'pago', 'enviado', 'entregue']; // Array literal
    if (statusValidos.includes(novoStatus)) this.status = novoStatus; // includes verifica membership
  }
  //#endregion

  //#region podeCancelar - Verifica se pode cancelar
  podeCancelar() { 
    return ['pendente', 'pago'].includes(this.status); // Retorna boolean
  }
  //#endregion
}

module.exports = Pedido; // Export default CommonJS
//#endregion