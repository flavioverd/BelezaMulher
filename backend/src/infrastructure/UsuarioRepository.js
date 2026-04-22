//#region Repository Usuario - Infraestrutura (PostgreSQL)
const Usuario = require('../domain/Usuario'); // Importa Entity

class UsuarioRepository {
  //#region constructor - Pool connection
  constructor(databaseConnection) { 
    this.db = databaseConnection; // pg Pool instance
  }
  //#endregion

  //#region salvar - INSERT novo usuário
  async salvar(usuario) {
    const query = `INSERT INTO usuarios (nome, email, senha, endereco, data_cadastro) VALUES ($1, $2, $3, $4, $5) RETURNING id`; // Placeholders $1-$5
    try { // try-catch-finally
      const result = await this.db.query(query, [usuario.nome, usuario.email, usuario.senha, usuario.endereco, usuario.dataCadastro]); // Array params
      usuario.id = result.rows[0].id; // Acessa rows[0] (primeira linha)
      return usuario; // Retorna entidade atualizada
    } 
    catch (error) { throw new Error('Erro ao salvar usuário: ' + error.message); } // throw Error
  }
  //#endregion

  //#region buscarPorEmail - SELECT WHERE email
  async buscarPorEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1'; // WHERE clause
    try { 
      const result = await this.db.query(query, [email]); // Param array
      return result.rows[0] || null; // || null fallback
    } 
    catch (error) { throw new Error('Erro ao buscar usuário: ' + error.message); }
  }
  //#endregion

  //#region buscarPorId - SELECT WHERE id
  async buscarPorId(id) {
    const query = 'SELECT id, nome, email, endereco, data_cadastro FROM usuarios WHERE id = $1'; // SELECT específico (sem senha)
    try { 
      const result = await this.db.query(query, [id]); // [id] = array
      return result.rows[0] || null; // Ternary || null
    } 
    catch (error) { throw new Error('Erro ao buscar usuário: ' + error.message); }
  }
  //#endregion

  //#region atualizar - UPDATE usuario
  async atualizar(id, dados) {
    const query = `UPDATE usuarios SET nome = $1, endereco = $2 WHERE id = $3 RETURNING id, nome, email, endereco, data_cadastro`; // SET e WHERE
    try { 
      const result = await this.db.query(query, [dados.nome, dados.endereco, id]); // 3 params
      return result.rows[0] || null; // Retorna row ou null
    } 
    catch (error) { throw new Error('Erro ao atualizar usuário: ' + error.message); }
  }
  //#endregion
}

module.exports = UsuarioRepository; // CommonJS export
//#endregion