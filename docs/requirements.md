# Requisitos do Sistema

## Funcionalidades Principais

### Catálogo de Produtos
- Listagem de roupas femininas com filtros (tamanho, cor, preço)
- Detalhes do produto: nome, descrição, imagens, preço, estoque
- Busca por nome ou categoria

### Gerenciamento de Usuários
- Cadastro e login de usuários
- Perfis com endereços de entrega
- Recuperação de senha

### Carrinho e Pedidos
- Adicionar/remover produtos do carrinho
- Checkout com cálculo de frete e total
- Status de pedidos: pendente, pago, enviado, entregue
- Histórico de pedidos por usuário

### Pagamentos
- Integração com gateways (Stripe, PayPal, Pix)
- Processamento seguro de cartões
- Confirmação de pagamentos

### Segurança
- Autenticação JWT
- Validação de dados de entrada
- Proteção contra ataques comuns (SQL injection, XSS)
- HTTPS obrigatório

## Requisitos Não-Funcionais
- Performance: tempo de resposta < 2s para APIs
- Escalabilidade: suportar 1000+ usuários simultâneos
- Disponibilidade: 99.9% uptime
- Responsividade: web e mobile adaptáveis
- Acessibilidade: conformidade WCAG 2.1

## Tecnologias
- Backend: Node.js + Express + PostgreSQL
- Web: React + React Router
- Mobile: React Native
- Segurança: bcrypt, JWT, Helmet
- Deploy: Docker + CI/CD