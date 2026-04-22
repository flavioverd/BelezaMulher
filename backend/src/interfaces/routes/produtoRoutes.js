//#region Produto Routes - Interface (Express Router)
const express = require('express'); // Import Express
const router = express.Router(); // Cria Router

//#region Define rotas - CRUD produto
module.exports = (produtoController) => {
  router.post('/', (req, res) => produtoController.criar(req, res)); // POST / -> criar
  router.get('/', (req, res) => produtoController.listar(req, res)); // GET / -> listar (com filtros)
  router.get('/:id', (req, res) => produtoController.buscarPorId(req, res)); // GET /:id -> buscarPorId
  router.put('/:id', (req, res) => produtoController.atualizar(req, res)); // PUT /:id -> atualizar
  router.delete('/:id', (req, res) => produtoController.deletar(req, res)); // DELETE /:id -> deletar
  return router; // Retorna configured router
};
//#endregion

//#endregion