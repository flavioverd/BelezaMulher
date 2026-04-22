//#region Repository Produto - Infraestrutura (PostgreSQL)
const Produto = require('../domain/Produto'); // Importa Entity

class ProdutoRepository {
  //#region constructor - Pool connection
  constructor(databaseConnection) { 
    this.db = databaseConnection; // pg Pool
  }
  //#endregion

  //#region salvar - INSERT produto
  async salvar(produto) {
    const query = `INSERT INTO produtos (nome, descricao, preco, tamanho, cor, imagem_url, estoque) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`; // 7 placeholders
    try { 
      const result = await this.db.query(query, [produto.nome, produto.descricao, produto.preco, produto.tamanho, produto.cor, produto.imagemUrl, produto.estoque]); // Array 7 elementos
      return this.mapToEntity(result.rows[0]); // Chama mapper
    } 
    catch (error) { throw new Error('Erro ao salvar produto: ' + error.message); }
  }
  //#endregion

  //#region buscarTodos - SELECT com filtros dinâmicos
  async buscarTodos(filtros = {}) { // Default object
    let query = 'SELECT * FROM produtos WHERE 1=1'; // 1=1 sempre verdade (permite AND)
    const valores = []; // Array vazio
    let paramIndex = 1; // Contador

    //#region Aplicar filtros dinamicamente
    if (filtros.nome) { query += ` AND nome ILIKE $${paramIndex}`; valores.push(`%${filtros.nome}%`); paramIndex++; } // ILIKE = case insensitive
    if (filtros.tamanho) { query += ` AND tamanho = $${paramIndex}`; valores.push(filtros.tamanho); paramIndex++; }
    if (filtros.cor) { query += ` AND cor ILIKE $${paramIndex}`; valores.push(`%${filtros.cor}%`); paramIndex++; }
    if (filtros.precoMin) { query += ` AND preco >= $${paramIndex}`; valores.push(filtros.precoMin); paramIndex++; }
    if (filtros.precoMax) { query += ` AND preco <= $${paramIndex}`; valores.push(filtros.precoMax); paramIndex++; }
    //#endregion

    try { 
      const result = await this.db.query(query, valores); // Query dinâmica
      return result.rows.map(row => this.mapToEntity(row)); // Map retorna array
    } 
    catch (error) { throw new Error('Erro ao buscar produtos: ' + error.message); }
  }
  //#endregion

  //#region buscarPorId - SELECT WHERE id
  async buscarPorId(id) {
    const query = 'SELECT * FROM produtos WHERE id = $1';
    try { 
      const result = await this.db.query(query, [id]);
      return result.rows[0] ? this.mapToEntity(result.rows[0]) : null; // Ternário inline
    } 
    catch (error) { throw new Error('Erro ao buscar produto: ' + error.message); }
  }
  //#endregion

  //#region atualizar - UPDATE produto
  async atualizar(id, produto) {
    const query = `UPDATE produtos SET nome = $1, descricao = $2, preco = $3, tamanho = $4, cor = $5, imagem_url = $6, estoque = $7 WHERE id = $8 RETURNING *`; // 8 params
    try { 
      const result = await this.db.query(query, [produto.nome, produto.descricao, produto.preco, produto.tamanho, produto.cor, produto.imagemUrl, produto.estoque, id]);
      return result.rows[0] ? this.mapToEntity(result.rows[0]) : null;
    } 
    catch (error) { throw new Error('Erro ao atualizar produto: ' + error.message); }
  }
  //#endregion

  //#region deletar - DELETE
  async deletar(id) {
    const query = 'DELETE FROM produtos WHERE id = $1 RETURNING *'; // RETURNING * confirma delete
    try { 
      const result = await this.db.query(query, [id]);
      return result.rows[0] ? true : false; // Boolean return
    } 
    catch (error) { throw new Error('Erro ao deletar produto: ' + error.message); }
  }
  //#endregion

  //#region mapToEntity - Mapper DB->Domain
  mapToEntity(row) { 
    return new Produto( // Construtor Entity
      row.id, 
      row.nome, 
      row.descricao, 
      parseFloat(row.preco), // parseFloat: string->float
      row.tamanho, 
      row.cor, 
      row.imagem_url, // snake_case (DB) -> camelCase (Domain)
      row.estoque, 
      row.data_criacao
    ); 
  }
  //#endregion
}

module.exports = ProdutoRepository; // Export
//#endregion