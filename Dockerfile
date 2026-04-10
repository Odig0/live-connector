# Dockerfile para TikTok Live Connector
# Build: docker build -t tiktok-live-connector .
# Run: docker run -p 3000:3000 --env-file .env tiktok-live-connector

# Etapa 1: Base de Node.js
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Copiar archivos de dependencias
COPY package*.json ./
COPY .env .env

# Instalar dependencias de npm
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Compilar TypeScript (si es necesario)
RUN npm run build 2>/dev/null || true

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/views', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Iniciar la aplicación
CMD ["npm", "run", "server"]
