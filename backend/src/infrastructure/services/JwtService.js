//#region JWT Service - Infraestrutura (jsonwebtoken)
const jwt = require('jsonwebtoken'); // Import jwt (CommonJS)

class JwtService {
  //#region constructor - Configuração
  constructor() {
    this.secret = process.env.JWT_SECRET || 'belezamulher-secret-key-2024'; // Secret key (env ou default)
    this.expireIn = process.env.JWT_EXPIRE_IN || '24h'; // Expiração token (24 horas)
  }
  //#endregion

  //#region sign - Gera token JWT
  sign(payload) { // payload = objeto JS (será JSON)
    return jwt.sign(payload, this.secret, { expiresIn: this.expireIn }); // sign(payload, secret, options)
  }
  //#endregion

  //#region verify - Verifica token JWT
  verify(token) {
    return jwt.verify(token, this.secret); // verify(token, secret) = retorna payload decodificado
  }
  //#endregion
}

module.exports = JwtService; // Export
//#endregion