//#region Produto Routes - Interface (Express Router)
const express = require('express'); // Import Express
const multer = require('multer'); // Import multer for file upload
const path = require('path');

// Configuração do multer (mesma do UploadService para consistência)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

//#region Define rotas - CRUD produto com upload de imagem
module.exports = (produtoController) => {
  const router = express.Router();
  
  // POST com upload de imagem única (campo chamado 'imagem')
  router.post('/', upload.single('imagem'), (req, res) => produtoController.criar(req, res));
  
  // GET listar (com filtros)
  router.get('/', (req, res) => produtoController.listar(req, res));
  
  // GET por ID
  router.get('/:id', (req, res) => produtoController.buscarPorId(req, res));
  
  // PUT com upload de imagem (substitui imagem existente)
  router.put('/:id', upload.single('imagem'), (req, res) => produtoController.atualizar(req, res));
  
  // DELETE
  router.delete('/:id', (req, res) => produtoController.deletar(req, res));
  
  return router; // Retorna configured router
};
//#endregion

//#region Servir arquivos estáticos de uploads
// Esta função pode ser chamada no index.js para servir a pasta uploads
module.exports.serveUploads = (app) => {
  const uploadsPath = path.join(__dirname, '..', '..', '..', 'uploads');
  app.use('/uploads', express.static(uploadsPath));
};
//#endregion

//#endregion