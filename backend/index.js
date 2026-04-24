//#region App Principal - Entry Point (Express)
const express = require('express'); // Framework web (Node.js)
const cors = require('cors'); // Cross-Origin Resource Sharing
const helmet = require('helmet'); // Headers segurança HTTP

//#region Imports camadas (Hexagonal)
const pool = require('./src/infrastructure/database/connection'); // Infrastructure: DB

const UsuarioRepository = require('./src/infrastructure/UsuarioRepository'); // Infrastructure: Repo
const ProdutoRepository = require('./src/infrastructure/ProdutoRepository');
const PedidoRepository = require('./src/infrastructure/PedidoRepository');

const CriarUsuarioUseCase = require('./src/application/CriarUsuarioUseCase'); // Application: UseCases
const LoginUseCase = require('./src/application/LoginUseCase');

const UsuarioController = require('./src/interfaces/UsuarioController'); // Interface: Controllers
const ProdutoController = require('./src/interfaces/ProdutoController');
const PedidoController = require('./src/interfaces/PedidoController');

const usuarioRoutes = require('./src/interfaces/routes/usuarioRoutes'); // Interface: Routes
const produtoRoutes = require('./src/interfaces/routes/produtoRoutes');
const pedidoRoutes = require('./src/interfaces/routes/pedidoRoutes');

const authMiddleware = require('./src/interfaces/middlewares/authMiddleware'); // Interface: Middlewares
const { validarUsuario, validarLogin, validarProduto, validarPedido } = require('./src/interfaces/middlewares/validacaoMiddleware');

const HashService = require('./src/infrastructure/services/HashService'); // Infrastructure: Services
const JwtService = require('./src/infrastructure/services/JwtService');
//#endregion

//#region Setup Express
const app = express(); // Instância Express

app.use(helmet()); // Middleware global: security headers
app.use(cors()); // Middleware global: CORS
app.use(express.json()); // Middleware global: parse JSON body
//#endregion

//#region Instanciação (DI - Injeção de Dependência)
// Services
const hashService = new HashService(); // Instância
const jwtService = new JwtService(); // Instância

// Repositories (Infrastructure)
const usuarioRepository = new UsuarioRepository(pool); // Pool injetado
const produtoRepository = new ProdutoRepository(pool);
const pedidoRepository = new PedidoRepository(pool);

// UseCases (Application)
const criarUsuarioUseCase = new CriarUsuarioUseCase(usuarioRepository, hashService); // Dependências injetadas
const loginUseCase = new LoginUseCase(usuarioRepository, hashService, jwtService);

// Controllers (Interface)
const usuarioController = new UsuarioController(criarUsuarioUseCase, loginUseCase, usuarioRepository);
const produtoController = new ProdutoController(produtoRepository);
const pedidoController = new PedidoController(pedidoRepository, produtoRepository);
//#endregion

//#region Routes (API Endpoints)
// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() })); // GET /health

// Auth
app.post('/auth/login', validarLogin, (req, res) => usuarioController.login(req, res)); // POST /auth/login (valida login)

// Usuário (CRUD)
app.post('/usuarios', validarUsuario, (req, res) => usuarioController.criarUsuario(req, res)); // POST /usuarios
app.get('/usuarios/:id', (req, res) => usuarioController.buscarUsuario(req, res)); // GET /usuarios/:id
app.put('/usuarios/:id', (req, res) => usuarioController.atualizarUsuario(req, res)); // PUT /usuarios/:id

// Produtos (CRUD)
app.use('/produtos', produtoRoutes(produtoController)); // Mount router em /produtos
// Serve uploaded files
produtoRoutes.serveUploads(app); // Serve uploads static files

// Pedidos (CRUD + auth)
app.use('/pedidos', validarPedido, authMiddleware, pedidoRoutes(pedidoController)); // Mount router, valida + auth
//#endregion

//#region Server start
const PORT = process.env.PORT || 3000; // || default (env ou 3000)
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); // Listen TCP
//#endregion

module.exports = app; // Export app (testes)
//#endregion