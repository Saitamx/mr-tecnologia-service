FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json ./
COPY yarn.lock* ./

# Instalar dependencias
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else yarn install; fi

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN yarn build

# Exponer el puerto
EXPOSE 3004

# Comando de inicio
CMD ["yarn", "start:prod"]
