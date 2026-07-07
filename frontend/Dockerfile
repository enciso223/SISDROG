# Dockerfile de desarrollo para SISDROG Desktop (React Native Windows).
#
# NOTA IMPORTANTE:
# React Native Windows requiere un entorno Windows con Visual Studio para compilar
# y ejecutar la aplicación nativa de escritorio. Este contenedor Linux sirve para:
#   - Instalar y cachear dependencias de Node.
#   - Ejecutar el Metro bundler durante el desarrollo.
#   - Correr lint y pruebas unitarias.
#
# Para compilar y ejecutar la app nativa de Windows se debe usar el host Windows:
#   pnpm run windows
#
FROM node:22-alpine

# Instalar pnpm de forma global.
RUN npm install -g pnpm

WORKDIR /app

# Instalar dependencias nativas básicas que requieren algunos paquetes de RN.
RUN apk add --no-cache python3 make g++

# Copiar solo los manifiestos de dependencias para aprovechar la caché de Docker.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 8081

CMD ["pnpm", "start"]
