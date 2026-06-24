# 🚀 SISDROG - Sistema Integral de Gestión para Droguería

Este proyecto es el Sistema Integral de Gestión para la Droguería Laureano Gómez (SISDROG), diseñado para sistematizar el control de inventarios, ventas y reportes mediante una arquitectura moderna y escalable.

## 🛠 Arquitectura y Tecnologías
* **Frontend:** React Native Windows — aplicación de escritorio nativa **solo para Windows** (TypeScript, arquitectura MVC). Sin soporte Android/iOS.
* **Backend:** FastAPI con Python y SQLAlchemy (Puerto 8000).
* **Base de Datos:** PostgreSQL 16 (Puerto 5432).
* **Infraestructura:** Docker y Docker Compose para backend/frontend (dev), compilación nativa en Windows con Visual Studio.

---

## 📋 Requisitos Previos

Para desplegar este proyecto en cualquier máquina local, asegúrate de tener instalado lo siguiente:
1. **Windows 10/11** (el frontend es una app nativa de Windows).
2. **Visual Studio 2022** con las cargas de trabajo:
   - *Desarrollo para la plataforma universal de Windows (UWP)*
   - *Desarrollo de escritorio con C++*
   - *Windows 10/11 SDK*
3. **Node.js** 18+.
4. **pnpm** 8+ (`npm install -g pnpm`).
5. **Docker Desktop**.
6. **Git**.
7. **Modo desarrollador** habilitado en Windows.

---

## 🚀 Instrucciones de Despliegue

### 1. Clonar el repositorio
Abre tu terminal y clona el proyecto en tu máquina local:

git clone <URL_DE_TU_REPOSITORIO>
cd SISDROG-develop


### 2. Levantar la infraestructura (Docker Compose)
Asegúrate de que no tengas otros servicios ocupando los puertos 8000, 5432 o 8081. En la raíz del proyecto, ejecuta el siguiente comando para construir y levantar todos los contenedores en segundo plano:

docker-compose up --build -d

*Nota: La primera vez que ejecutes este comando, puede tomar varios minutos mientras descarga las imágenes base (Node, Python, Postgres) e instala las dependencias.*

### 3. Ejecutar el frontend nativo de Windows
El frontend no corre en el navegador. Abre una terminal en `frontend/` y ejecuta:

```powershell
cd frontend
pnpm install
pnpm run windows
```

### 4. Acceder a los servicios

* 🖥️ **Frontend:** ventana nativa de Windows generada por `run-windows`.
* ⚙️ **Backend (Documentación Swagger):** http://localhost:8000/docs
* 📦 **Metro Bundler:** http://localhost:8081

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

### 2. Error "Network Error" al guardar/buscar (Problemas de CORS o conexión)
Si el frontend no se puede comunicar con el backend, asegúrate de:
* Que el contenedor del backend esté corriendo (`docker logs -f pharmacy_backend`).
* Que el frontend apunte a `http://localhost:8000` en `frontend/src/config/constants.ts`.
* Que no estés accediendo desde una IP de red si el backend está configurado solo para `localhost`.
