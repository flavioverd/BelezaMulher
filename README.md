# E-commerce Roupas Femininas

Projeto completo de e-commerce para vendas de roupas femininas, com site web e apps mobile (Android/iOS), backend compartilhado e arquitetura hexagonal.

## Visão Geral
- **Domínio**: Vendas online de moda feminina
- **Público**: Mulheres interessadas em roupas
- **Funcionalidades**: Catálogo, carrinho, pedidos, pagamentos
- **Segurança**: Autenticação robusta, dados protegidos

## Estrutura do Projeto
```
BelezaMulher/
├── backend/          # API Node.js + Express
│   ├── src/
│   │   ├── domain/       # Entidades, regras negócio
│   │   ├── application/  # Casos de uso
│   │   ├── infrastructure/ # Adaptadores (banco, APIs)
│   │   └── interfaces/   # Controllers, middlewares
│   └── package.json
├── web/              # SPA React
│   ├── src/
│   └── package.json
├── mobile/           # React Native
│   └── BelezaMulherApp/
└── docs/             # Documentação
    ├── requirements.md
    ├── use-cases.md
    ├── architecture.md
    └── diagrams.md
```

## Como Começar
1. Instalar dependências: `npm install` em backend, web, mobile
2. Configurar banco: PostgreSQL local ou Docker
3. Rodar backend: `npm start` em backend
4. Rodar web: `npm start` em web
5. Para mobile: seguir docs do React Native

## Roadmap
- [x] Planejamento e modelagem
- [x] Setup projeto
- [x] Desenvolvimento backend
- [x] Desenvolvimento web
- [x] Desenvolvimento mobile
- [ ] Testes e segurança
- [ ] Deploy

## Contribuição
Projeto solo, mas aberto a sugestões.

## Licença
MIT