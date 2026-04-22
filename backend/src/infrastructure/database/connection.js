//#region Database Connection - Infraestrutura (PostgreSQL Pool)
const { Pool } = require('pg'); // Destructuring import (CommonJS)

//#region Configuração pool
const pool = new Pool({ // Pool gerencia múltiplas conexões
  host: process.env.DB_HOST || 'localhost', // || = OR lógico (default)
  port: process.env.DB_PORT || 5432, // Porta PostgreSQL default
  database: process.env.DB_NAME || 'belezamulher', // Nome DB
  user: process.env.DB_USER || 'postgres', // Usuário default
  password: process.env.DB_PASSWORD || 'postgres', // Senha default
  max: 20, // Máx conexões simultâneas
  idleTimeoutMillis: 30000, // Timeout conexão ociosa (30s)
  connectionTimeoutMillis: 2000 // Timeout conexão nova (2s)
});
//#endregion

//#region Error handler
pool.on('error', (err) => { // Event listener 'error'
  console.error('Erro inesperado no banco de dados:', err); // console.error
});
//#endregion

module.exports = pool; // Export pool instance (singleton)
//#endregion