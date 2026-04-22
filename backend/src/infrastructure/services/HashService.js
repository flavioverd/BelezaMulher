//#region Hash Service - Infraestrutura (bcryptjs)
const bcrypt = require('bcryptjs'); // Import bcrypt (CommonJS)

class HashService {
  //#region hash - Gera hash de senha
  async hash(senha) {
    const salt = await bcrypt.genSalt(10); // genSalt(rounds) = 10 = 2^10 iterações
    return bcrypt.hash(senha, salt); // hash(senha, salt) = retorna hash
  }
  //#endregion

  //#region compare - Compara senha com hash
  async compare(senha, hash) {
    return bcrypt.compare(senha, hash); // Retorna boolean (true/false)
  }
  //#endregion
}

module.exports = HashService; // Export
//#endregion