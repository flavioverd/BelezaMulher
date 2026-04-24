# Testes e Segurança

## Visão Geral

Este documento descreve a estratégia de testes e as medidas de segurança implementadas no projeto BelezaMulher.

---

## Testes

### Estrutura

Os testes são executados com **Jest** e seguem a estrutura:

```
backend/
├── jest.config.js          # Configuração Jest
├── src/
│   ├── application/
│   │   ├── CriarUsuarioUseCase.test.js
│   │   └── LoginUseCase.test.js
│   ├── infrastructure/
│   │   └── services/
│   │       ├── HashService.test.js
│   │       └── JwtService.test.js
│   └── interfaces/
│       └── API.test.js
```

### Scripts

| Comando | Descrição |
|---------|----------|
| `npm test` | Executa todos os testes |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Executa com coverage report |
| `npm run test:ci` | Executa para CI/CD |

### Cobertura

- **Use Cases**: Testes unitários com mocks (Jest.fn())
- **Services**: Testes unitários com instâncias reais
- **API**: Testes de integração com supertest

### Testes Unitários

#### CriarUsuarioUseCase.test.js

```js
//#region Testes CriarUsuarioUseCase
describe('CriarUsuarioUseCase', () => {
  //deve criar usuário com dados válidos
  //deve lançar erro quando email já existe
  //deve lançar erro com nome muito curto
  //deve lançar erro com email inválido
  //deve lançar erro com senha muito curta
});
```

#### LoginUseCase.test.js

```js
//#region Testes LoginUseCase
describe('LoginUseCase', () => {
  //deve fazer login com credenciais válidas
  //deve lançar erro quando email não existe
  //deve lançar erro quando senha incorreta
  //deve lançar erro quando campos vazios
});
```

#### HashService.test.js

```js
//#region Testes HashService
describe('HashService', () => {
  //deve gerar hash diferente da senha original
  //deve gerar hashes diferentes para mesma senha (salt único)
  //deve retornar true para senha correta
  //deve retornar false para senha incorreta
});
```

#### JwtService.test.js

```js
//#region Testes JwtService
describe('JwtService', () => {
  //deve gerar token JWT válido
  //deve verificar token válido e retornar payload
  //deve lançar erro para token inválido
  //deve lançar erro para token com secret diferente
});
```

### Testes de Integração

#### API.test.js

```js
//#region Testes API
describe('API Integration Tests', () => {
  //GET /health - retorna status OK
  //POST /auth/login - valida credenciais
  //POST /usuarios - cria usuário
  //GET /produtos - lista produtos
});
```

---

## Segurança

### Autenticação

#### JWT (JSON Web Token)

- **Algoritmo**: HS256
- **Expiração**: 24h (configurável via `JWT_EXPIRE_IN`)
- **Secret**: Variável de ambiente `JWT_SECRET`

```js
//Geração de token
const token = jwtService.sign({ id: usuario.id, email: usuario.email });

//Verificação de token
const payload = jwtService.verify(token);
```

#### Senhas

- **Hash**: bcryptjs com salt rounds = 10
- **Comparação**: bcrypt.compare()

```js
//Hash de senha
const hash = await hashService.hash(senha);

//Validação de senha
const valida = await hashService.compare(senha, hash);
```

### Middlewares de Segurança

#### Helmet

Configura headers HTTP seguros:

```js
app.use(helmet()); // X-Content-Type-Options, X-Frame-Options, etc.
```

#### CORS

Controla acesso cross-origin:

```js
app.use(cors()); // Permite requisições de qualquer origem
```

#### Validação

Validação de entrada com Joi:

```js
//Exemplo de schema de validação
const schema = Joi.object({
  nome: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required()
});
```

#### Autenticação de Rotas

Middleware para proteger rotas autenticadas:

```js
//Proteção de rotas
app.use('/pedidos', authMiddleware, pedidoRoutes);
//authMiddleware verifica token JWT
```

### Boas Práticas

1. **Nunca armazenar senhas em plaintext** - Sempre usar hash
2. **Tokens com expiração** - Evita tokens infinitos
3. **Validação de entrada** - Previne dados maliciosos
4. **Headers de segurança** - Helmet
5. **CORS restrito** - Configurar origens permitidas
6. **Variáveis de ambiente** - Secrets fora do código

---

## Executando Testes

```bash
# Instalação de dependências
cd backend
npm install

# Executar testes
npm test

# Com coverage
npm run test:coverage
```

---

## Resultados

- **Testes passando**: 22/25
- **Cobertura**: Aplicação, Infrastructure, Interfaces

---

## Próximos Passos

- Adicionar testes para Web e Mobile
- Implementar testes E2E com Cypress
- Configurar CI/CD (GitHub Actions)
- Adicionar rate limiting
- Configurar HTTPS