# Deploy

## Visão Geral

Este documento descreve o processo de deploy do projeto BelezaMulher para ambientes de produção.

---

## Estrutura de Deploy

```
BelezaMulher/
├── backend/
│   ├── Dockerfile          # Container API
│   ├── .dockerignore    # Arquivos ignorados
│   └── package.json
├── web/
│   ├── Dockerfile        # Container Web
│   ├── nginx.conf       # Configuração Nginx
│   └── .dockerignore
├── docker-compose.prod.yml # Orquestração produção
└── .github/workflows/
    └── ci-cd.yml        # Pipeline CI/CD
```

---

## Opções de Deploy

### 1. Docker Compose (Recomendado)

#### Pré-requisitos
- Docker 20.10+
- Docker Compose 2.0+

#### Variáveis de ambiente

Criar arquivo `.env`:

```bash
DB_PASSWORD=senha_segura_bd
JWT_SECRET=token_secreto_jwt
```

#### Deploy

```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Subir serviços
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar serviços
docker-compose -f docker-compose.prod.yml down
```

#### Portas expostas

| Serviço | Porta |
|---------|------|
| Backend API | 3000 |
| Web | 80 |
| PostgreSQL | 5432 |

---

### 2. GitHub Actions (CI/CD)

#### Configuração

No repositório GitHub, configurar secrets:

- `DOCKER_USERNAME` - Usuário Docker Hub
- `DOCKER_PASSWORD` - Senha Docker Hub
- `SERVER_HOST` - IP do servidor
- `SERVER_USER` - Usuário SSH
- `SERVER_SSH_KEY` - Chave SSH privada

#### Workflow

O pipeline executa:

1. **Build**: Testes e build em ubuntu-latest
2. **Docker**: Build e push das imagens
3. **Deploy**: Deploy para servidor production

#### Gatilhos

| Evento | Ação |
|--------|------|
| Push em main | Deploy production |
| Push em develop | Build apenas |
| Pull request | Testes apenas |

---

### 3. Deploy Manual (VPS/Cloud)

#### Servidor

```bash
# InstalaçãoDocker
curl -fsSL https://get.docker.com | sh

# Iniciar serviço
systemctl startdocker
systemctl enable docker

# Criar usuário app
useradd -m -s /bin/bash app
usermod -aG docker app
```

#### Backend

```bash
# Build
cd backend
npm install --production

# Variáveis de ambiente
export DB_HOST=localhost
export DB_PASSWORD=senha
export JWT_SECRET=token

# Iniciar
node index.js
```

#### Web

```bash
# Build React
cd web
npm run build

# Nginx
server {
    listen 80;
    root /app/build;
    location / {
        try_files $uri /index.html;
    }
}
```

---

## Checklist Pré-Deploy

- [ ] testes passando
- [ ] build sem erros
- [ ] variáveis de ambiente configuradas
- [ ] banco de dados migrado
- [ ] SSL/HTTPS configurado
- [ ] domínio apontado
- [ ] logs configurados
- [ ] backup do banco

---

## Monitoramento

### Logs

```bash
# Docker
docker logs belezamulher_backend
docker logs belezamulher_web

# Aplicação
docker exec belezamulher_backend tail -f /var/log/app.log
```

### Health Check

```bash
# Backend
curl http://localhost:3000/health

# Web
curl http://localhost:80
```

---

## Rollback

```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --force-recreate

# Docker images anteriores
docker pull belezamulher/backend:tag_anterior
docker pull belezamulher/web:tag_anterior
```

---

## Próximos Passos

- [ ] Configurar domínio com SSL
- [ ] Configurar CDN para assets
- [ ] Configurar monitoramento (Prometheus/Grafana)
- [ ] Configurar alertas
- [ ] Configurar backup automático