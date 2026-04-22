//#region Auth Middleware - Interface (Express JWT)
const JwtService = require('../../infrastructure/services/JwtService'); // Import Service
const jwtService = new JwtService(); // Instância

//#region authMiddleware - Protege rotas (JWT Bearer)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // Header: "Bearer <token>"
  
  //#region Valida header
  if (!authHeader) return res.status(401).json({ erro: 'Token não fornecido' }); // 401 Unauthorized
  //#endregion

  const parts = authHeader.split(' '); // split(' ') = ['Bearer', 'token']
  
  //#region Valida formato
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ erro: 'Token mal formatado' }); // 401
  //#endregion

  const token = parts[1]; // Extrai token (índice 1)

  //#region Verifica token
  try {
    const decoded = jwtService.verify(token); // verify() = decodifica e valida
    req.usuario = decoded; // Adiciona ao request (disponível nas próximas rotas)
    next(); // Próximo middleware/rota
  } 
  catch (error) { return res.status(401).json({ erro: 'Token inválido' }); } // 401
  //#endregion
};
//#endregion

module.exports = authMiddleware; // Export
//#endregion