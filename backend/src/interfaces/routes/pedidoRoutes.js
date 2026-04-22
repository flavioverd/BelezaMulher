//#region Pedido Routes - Interface (Express Router)
const express = require('express'); // Import Express
const router = express.Router(); // Cria Router

//#region Define rotas - CRUD pedido
module.exports = (pedidoController) => {
  router.post('/', (req, res) => pedidoController.criar(req, res)); // POST / -> criar
  router.get('/', (req, res) => pedidoController.listar(req, res)); // GET / -> listar todos
  router.get('/usuario/:usuarioId', (req, res) => pedidoController.buscarPorUsuario(req, res)); // GET /usuario/:id -> buscarPorUsuario
  router.get('/:id', (req, res) => pedidoController.buscarPorId(req, res)); // GET /:id -> buscarPorId
  router.patch('/:id/status', (req, res) => pedidoController.atualizarStatus(req, res)); // PATCH /:id/status -> atualizarStatus
  return router; // Retorna configured router
};
//#endregion

//#endregion