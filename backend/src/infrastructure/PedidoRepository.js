//#region Repository Pedido - Persistência de pedidos no banco
const Pedido = require('../domain/Pedido'); // Importa entidade Pedido (domain)

class PedidoRepository { // Classe para operações CRUD com pedidos
  constructor(databaseConnection) { this.db = databaseConnection; } // Recebe conexão via injeção de dependência

  //#region criar - Insere novo pedido com transação
  async criar(pedido) {
    const client = await this.db.connect(); // Obtém cliente do pool de conexões
    try {
      await client.query('BEGIN'); // Inicia transação SQL (BEGIN)
      const pedidoQuery = `INSERT INTO pedidos (usuario_id, status, total) VALUES ($1, $2, $3) RETURNING *`; // Query INSERT com RETURNING
      const pedidoResult = await client.query(pedidoQuery, [pedido.usuarioId, pedido.status, pedido.total]); // Executa query com parâmetros
      const pedidoId = pedidoResult.rows[0].id; // Acessa ID retornado pelo banco
      const itensInseridos = []; // Array vazio para armazenar itens
      for (const item of pedido.itens) { // Loop for...of para iterar array de itens
        const itemQuery = `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4) RETURNING *`; // Query para itens
        const itemResult = await client.query(itemQuery, [pedidoId, item.produtoId, item.quantidade, item.precoUnitario]); // Executa insert item
        itensInseridos.push(itemResult.rows[0]); // Push adiciona elemento ao array
      }
      await client.query('COMMIT'); // Confirma transação ( COMMIT )
      return new Pedido(pedidoId, pedido.usuarioId, new Date(), pedido.status, pedido.total, itensInseridos); // Retorna nova instância de Pedido
    } catch (error) { await client.query('ROLLBACK'); throw new Error('Erro ao criar pedido: ' + error.message); } // catch trata erros, ROLLBACK desfaz transação
    finally { client.release(); } // finally sempre executa, release libera cliente do pool
  }
  //#endregion

  //#region buscarPorId - Busca pedido por ID
  async buscarPorId(id) {
    const query = 'SELECT * FROM pedidos WHERE id = $1'; // String template com placeholder $1
    try { 
      const result = await this.db.query(query, [id]); // Query com parâmetros array [id]
      if (!result.rows[0]) return null; // Condicional retorna null se array vazio
      const itensQuery = 'SELECT * FROM itens_pedido WHERE pedido_id = $1'; // Nested query para itens
      const itensResult = await this.db.query(itensQuery, [id]); // Query encadeada
      return this.mapToEntity(result.rows[0], itensResult.rows); // Chama método mapToEntity
    } 
    catch (error) { throw new Error('Erro ao buscar pedido: ' + error.message); } // Throw lança erro para camada superior
  }
  //#endregion

  //#region buscarPorUsuario - Busca pedidos de um usuário
  async buscarPorUsuario(usuarioId) {
    const query = 'SELECT * FROM pedidos WHERE usuario_id = $1 ORDER BY data_pedido DESC'; // ORDER BY DESC ordenação decrescente
    try { 
      const result = await this.db.query(query, [usuarioId]); // Await espera Promise resolver
      return result.rows.map(row => this.mapToEntity(row, [])); // Map transforma array, arrow function inline
    } 
    catch (error) { throw new Error('Erro ao buscar pedidos: ' + error.message); }
  }
  //#endregion

  //#region buscarTodos - Lista todos os pedidos
  async buscarTodos() {
    const query = 'SELECT * FROM pedidos ORDER BY data_pedido DESC'; // Query simples sem filtros
    try { 
      const result = await this.db.query(query); // Query sem parâmetros (array vazio opcional)
      return result.rows.map(row => this.mapToEntity(row, [])); // Map retorna array de entidades
    } 
    catch (error) { throw new Error('Erro ao buscar pedidos: ' + error.message); }
  }
  //#endregion

  //#region atualizarStatus - Atualiza status do pedido
  async atualizarStatus(id, status) {
    const query = 'UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *'; // UPDATE com SET e WHERE
    try { 
      const result = await this.db.query(query, [status, id]); // Múltiplos parâmetros em array
      return result.rows[0] ? this.mapToEntity(result.rows[0], []) : null; // Operador ternário (condição ? true : false)
    } 
    catch (error) { throw new Error('Erro ao atualizar status: ' + error.message); }
  }
  //#endregion

  //#region mapToEntity - Converte row do banco em entidade
  mapToEntity(row, itens = []) { // Default parameter array vazio
    return new Pedido( // Construtor da entidade
      row.id, // Propriedades do row (underscore naming do PostgreSQL)
      row.usuario_id, 
      row.data_pedido, 
      row.status, 
      parseFloat(row.total), // parseFloat converte string em número decimal
      itens
    );
  }
  //#endregion
}

module.exports = PedidoRepository; // CommonJS export (module.exports)
//#endregion