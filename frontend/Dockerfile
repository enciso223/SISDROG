# Etapa 1: Construcción (Build)
FROM node:18-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias e instalar
COPY package.json package-lock.json* ./
RUN npm install

# Copiar el resto del código y construir la aplicación
COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Eliminar la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Crear configuración específica para React Router
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]