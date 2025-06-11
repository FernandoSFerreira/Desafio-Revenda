# Imagem oficial do Node.js como base
FROM node:22-alpine AS build

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Limpa o cache e instala as dependências
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Copia o código-fonte da aplicação
COPY . .

# Compila a aplicação para produção
RUN npm run build --prod

# Usa uma imagem Nginx para servir a aplicação Angular
FROM nginx:alpine

# Remove arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos compilados para o servidor Nginx
# Verifique se o nome da pasta dist está correto
COPY --from=build /app/dist/Desafio-Fabrica-Pedidos-Front/browser/* /usr/share/nginx/html/

# Copia configuração customizada do Nginx (opcional)
COPY nginx.conf /etc/nginx/nginx.conf

# Exposição da porta padrão do Nginx
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]