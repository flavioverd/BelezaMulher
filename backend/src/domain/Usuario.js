//#region Entity Usuario - Domínio
class Usuario {
  //#region constructor - Inicializa entidade
  constructor(id, nome, email, senha, endereco, dataCadastro) {
    this.id = id; // Atribui id passado ou null
    this.nome = nome; // Atribui nome
    this.email = email; // Atribui email (único)
    this.senha = senha; // Atribui senha (hash)
    this.endereco = endereco; // Atribui endereço (opcional)
    this.dataCadastro = dataCadastro || new Date(); // Default: Data atual
  }
  //#endregion

  //#region atualizarDados - Modifica dados existentes
  atualizarDados(novoNome, novoEmail, novoEndereco) {
    if (novoNome) this.nome = novoNome; // Atribui setruthy (não null/undefined/'')
    if (novoEmail) this.email = novoEmail; // Validação simples
    if (novoEndereco) this.endereco = novoEndereco; // Atribuição condicional
  }
  //#endregion

  //#region verificarSenha - Compara senha com hash
  verificarSenha(senhaFornecida) {
    const bcrypt = require('bcryptjs'); // Importa bcrypt ( CommonJS require )
    return bcrypt.compareSync(senhaFornecida, this.senha); // Retorna boolean
  }
  //#endregion
}

module.exports = Usuario; // Exporta classe
//#endregion