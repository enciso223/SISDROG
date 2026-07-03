# 🚀 SISDROG - Sistema Integral de Gestión para Droguería

Este proyecto es el Sistema Integral de Gestión para la Droguería Laureano Gómez (SISDROG), diseñado para sistematizar el control de inventarios, ventas y reportes mediante una arquitectura moderna y escalable.

## 🛠 Arquitectura y Tecnologías
* **Frontend:** React.js servido a través de Nginx (Puerto 3000).
* **Backend:** FastAPI con Python y SQLAlchemy (Puerto 8000).
* **Base de Datos:** PostgreSQL 16 (Puerto 5432).
* **Infraestructura:** Docker y Docker Compose para un despliegue aislado y consistente.

---

## 📋 Requisitos Previos

Para desplegar este proyecto en cualquier máquina local, asegúrate de tener instalado lo siguiente:
1. Docker Desktop (o Docker Engine + Docker Compose en Linux).
2. Git (para clonar el repositorio).

---

## 🚀 Instrucciones de Despliegue

### 1. Clonar el repositorio
Abre tu terminal y clona el proyecto en tu máquina local:

git clone <URL_DE_TU_REPOSITORIO>
cd SISDROG-develop


### 2. Levantar la infraestructura (Docker Compose)
Asegúrate de que no tengas otros servicios ocupando los puertos 3000, 8000 o 5432. En la raíz del proyecto, ejecuta el siguiente comando para construir y levantar todos los contenedores en segundo plano:

docker-compose up --build -d

*Nota: La primera vez que ejecutes este comando, puede tomar algunos minutos mientras descarga las imágenes base (Node, Python, Postgres) e instala las dependencias.*

### 3. Acceder a la Aplicación
Una vez que la terminal indique que los contenedores están iniciados (Running / Started), puedes acceder a los servicios desde tu navegador:

* 🌐 **Frontend (Interfaz Gráfica):** http://localhost:3000
* ⚙️ **Backend (Documentación Swagger):** http://localhost:8000/docs

---

## 🛑 Comandos Útiles de Gestión

Para administrar los contenedores de la aplicación, utiliza los siguientes comandos en la raíz del proyecto:

**Detener la aplicación (sin borrar datos):**
docker-compose stop

**Apagar la aplicación y eliminar los contenedores (la base de datos persistirá en su volumen):**
docker-compose down

**Ver los registros (logs) del Backend en tiempo real:**
docker logs -f pharmacy_backend

**Reconstruir el proyecto ignorando el caché (útil si hay fallos o cambios grandes):**
docker-compose up --build --force-recreate -d

---

## 🔧 Solución de Problemas Frecuentes (Troubleshooting)

### 1. Error: "Bind for 0.0.0.0:8000 failed: port is already allocated"
Esto significa que otro contenedor u otro programa en tu computador está usando el puerto del backend o frontend. 
* **Solución:** Detén cualquier otro proyecto de Docker ejecutando `docker stop <ID_DEL_CONTENEDOR>` o cierra el programa que ocupe el puerto.

### 2. La pantalla del Frontend se ve en blanco
Generalmente es un problema de caché del navegador al cargar los archivos estáticos de Nginx.
* **Solución:** Haz una recarga forzada en tu navegador presionando `Cmd + Shift + R` (Mac) o `Ctrl + Shift + R` (Windows).

### 3. Error "Network Error" al guardar/buscar (Problemas de CORS)
Si el frontend no se puede comunicar con el backend, asegúrate de que estás ingresando a la aplicación a través de `http://localhost:3000` y no desde una IP de red, ya que el backend está configurado para confiar estrictamente en el origen `localhost`.
