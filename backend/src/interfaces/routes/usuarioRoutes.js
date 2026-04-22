//#region Usuario Routes - Interface (Express Router)
const express = require('express'); // Import Express
const router = express.Router(); // Cria Router

//#region Define rotas - Mapeia HTTP verb -> Controller method
module.exports = (usuarioController) => {
  router.post('/registrar', (req, res) => usuarioController.criarUsuario(req, res)); // POST /registrar -> criarUsuario
  router.post('/login', (req, res) => usuarioController.login(req, res)); // POST /login -> login
  router.get('/:id', (req, res) => usuarioController.buscarUsuario(req, res)); // GET /:id -> buscarUsuario
  router.put('/:id', (req, res) => usuarioController.atualizarUsuario(req, res)); // PUT /:id -> atualizarUsuario
  return router; // Retorna configured router
};
//#endregion

//#endregion