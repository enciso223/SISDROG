# SISDROG Desktop — Frontend

Aplicación de escritorio **solo para Windows** desarrollada con **React Native Windows**, **TypeScript** y arquitectura **MVC**.

> Las carpetas `android/` e `ios/` fueron eliminadas porque este proyecto no tiene soporte móvil.

---

## 🏗 Arquitectura MVC

El código fuente vive en `src/` y está organizado en capas claras:

```
frontend/
├── src/
│   ├── config/              # Constantes globales (URL del backend, timeouts)
│   │   └── constants.ts
│   ├── models/              # Modelos de dominio, tipos e interfaces
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Sale.ts
│   │   └── index.ts
│   ├── services/            # Comunicación HTTP con el backend FastAPI
│   │   ├── api.ts
│   │   ├── AuthService.ts
│   │   ├── InventoryService.ts
│   │   ├── SalesService.ts
│   │   └── index.ts
│   ├── controllers/         # Hooks que orquestan lógica de negocio
│   │   ├── useAuthController.ts
│   │   ├── useInventoryController.ts
│   │   ├── useSalesController.ts
│   │   └── index.ts
│   ├── views/               # Componentes visuales y pantallas
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   └── screens/
│   │       ├── LoginScreen.tsx
│   │       ├── HomeScreen.tsx
│   │       ├── InventoryScreen.tsx
│   │       └── index.ts
│   └── App.tsx              # Punto de entrada y navegación simple
├── windows/                 # Proyecto nativo de Windows generado por RNW
├── package.json
├── tsconfig.json
├── metro.config.js
├── Dockerfile
└── .dockerignore
```

### Diagrama de flujo MVC

```
┌─────────────────────────────────────────────────────────────────┐
│                           VISTAS (Views)                         │
│        LoginScreen, HomeScreen, InventoryScreen, Button, Input   │
│                    Capturan eventos del usuario                  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ eventos
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CONTROLADORES (Controllers)                │
│     useAuthController, useInventoryController, useSalesController│
│  • Reciben eventos de la vista                                   │
│  • Llaman a los servicios                                        │
│  • Manejan estado y errores                                      │
│  • Devuelven datos listos para renderizar                        │
└───────────────────────────────┬─────────────────────────────────┘
                                │ fetch / mutate
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SERVICIOS (Services)                    │
│              api.ts — cliente Axios sobre FastAPI                │
│            AuthService, InventoryService, SalesService           │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP / REST
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          BACKEND (FastAPI)                       │
│                     http://localhost:8000                        │
└─────────────────────────────────────────────────────────────────┘
                                ▲
                                │ tipos / validaciones
┌───────────────────────────────┴─────────────────────────────────┐
│                           MODELOS (Models)                       │
│                  User, Product, Sale, enums                      │
│          Compartidos entre Views, Controllers y Services         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Requisitos para desarrollo nativo en Windows

1. **Node.js** 18+ (se recomienda LTS 20).
2. **pnpm** 8+ instalado globalmente:
   ```powershell
   npm install -g pnpm
   ```
3. **Visual Studio 2022** con las siguientes cargas de trabajo:
   - *Desarrollo para la plataforma universal de Windows (UWP)*
   - *Desarrollo de escritorio con C++*
   - *Windows 10/11 SDK*
4. **Habilitar modo desarrollador** en Windows.
5. **Docker Desktop** (opcional, para backend/frontend dev).

---

## 🛠 Comandos útiles

```powershell
# Instalar dependencias
pnpm install

# Iniciar Metro bundler
pnpm start

# Ejecutar la app nativa de Windows (requiere Visual Studio)
pnpm run windows

# Verificar tipos
pnpm exec tsc --noEmit

# Lint
pnpm run lint

# Pruebas
pnpm test
```

---

## 🐳 Docker

El `Dockerfile` actual es un contenedor de **desarrollo Linux** que:

- Instala dependencias de Node.
- Ejecuta el Metro bundler en el puerto `8081`.
- Permite correr lint y pruebas.

> ⚠️ React Native Windows **no puede compilarse dentro de un contenedor Linux** porque requiere las herramientas nativas de Windows. Para ejecutar la app de escritorio se debe usar el host Windows con Visual Studio.

### Levantar solo backend y bundler

```bash
docker-compose up --build -d
```

Esto levanta:

- Backend en http://localhost:8000
- Base de datos en localhost:5432
- Metro bundler en localhost:8081

Luego, en el host Windows:

```powershell
cd frontend
npx react-native run-windows
```

---

## 🔌 Conexión con el backend

Por defecto el frontend apunta a:

```ts
API_BASE_URL = 'http://localhost:8000'
```

Edita `src/config/constants.ts` si el backend está en otra URL.

---

## 📦 Dependencias principales

- `react-native` 0.74.5
- `react-native-windows` 0.74.59
- `react` 18.2.0
- `typescript` 5.0.4
- `axios` (llamadas HTTP)
- `pnpm` 11.5.2 (gestor de paquetes)

> El proyecto incluye `packageManager` en `package.json` para forzar el uso de pnpm.

---

## 📝 Notas

- El backend actualmente expone principalmente el módulo `/auth`. Los servicios de `inventory`, `sales`, etc. están preparados para cuando los endpoints estén disponibles.
- La navegación es intencionalmente simple (por estado local) para mantener el proyecto "en blanco" y permitir agregar `react-navigation` más adelante si se desea.
