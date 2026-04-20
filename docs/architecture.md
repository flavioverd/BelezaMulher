# Arquitetura do Sistema

## Arquitetura Hexagonal

O sistema segue a arquitetura hexagonal (Ports and Adapters), separando o domínio de negócio das interfaces externas.

### Camadas
- **Domínio**: Entidades, regras de negócio puras
- **Aplicação**: Casos de uso, comandos, queries
- **Infraestrutura**: Adaptadores para banco, APIs externas
- **Interfaces**: Web, mobile, APIs

### Benefícios
- Desacoplamento: mudanças em interfaces não afetam domínio
- Testabilidade: casos de uso testáveis isoladamente
- Manutenibilidade: código organizado por responsabilidade

## Tecnologias por Camada

### Backend (Node.js)
- **Framework**: Express.js
- **Banco**: PostgreSQL com pg driver
- **Autenticação**: JWT com bcrypt
- **Validação**: Joi
- **Segurança**: Helmet, CORS

### Web (React)
- **Roteamento**: React Router
- **HTTP**: Axios
- **Estilização**: Styled Components

### Mobile (React Native)
- **Navegação**: React Navigation
- **Armazenamento**: Async Storage
- **HTTP**: Axios

### DevOps
- **Containerização**: Docker
- **CI/CD**: GitHub Actions
- **Monitoramento**: Logs em console/file