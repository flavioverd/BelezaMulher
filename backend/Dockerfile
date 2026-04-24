# Dockerfile - Backend BelezaMulher
# Ambiente de produção

# Imagem base Node.js 20 LTS
FROM node:20-alpine

# Nome do container
LABEL maintainer="BelezaMulher"

##region Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
##endregion

##region Diretório de trabalho
WORKDIR /app
#/#endregion

##region Cópia de arquivos
COPY package*.json ./
#/#endregion

##region Instalação de dependências
RUN npm ci --only=production
#/#endregion

##region Cópia do código fonte
COPY . .
#/#endregion

##region Exposição da porta
EXPOSE 3000
#/#endregion

##region Inicialização
CMD ["node", "index.js"]
#/#endregion