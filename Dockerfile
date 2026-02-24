FROM node:18-alpine

# Instalar yarn globalmente
RUN npm install -g yarn

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json yarn.lock* ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN yarn build

# Exponer el puerto
EXPOSE 3004

# Comando de inicio
CMD ["yarn", "start:prod"]
