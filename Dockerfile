# Imagem oficial do Node.js como base
FROM node:22.16 AS build

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copia o código-fonte da aplicação
COPY . .

# Compila a aplicação para produção
RUN npm run build --prod

# Usa uma imagem Nginx para servir a aplicação Angular
FROM nginx:alpine

# Copia os arquivos compilados para o servidor Nginx
COPY --from=build /app/dist/desafio-fabrica-pedidos-front /usr/share/nginx/html

# Exposição da porta padrão do Nginx
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]