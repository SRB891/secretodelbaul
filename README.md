# El Secreto del Baúl — Sistema Web E-Commerce y Gestión Logística

Plataforma web de comercio electrónico y control logístico desarrollada para la microempresa de joyería y bisutería artesanal **El Secreto del Baúl S.A.S.** (Medellín, Colombia).

**Autores:**
- Sebastian Guerrero Cano
- Santiago Rueda Bermúdez  
*Programa Ingeniería en Software — Institución Universitaria Pascual Bravo (2026)*

---

## Arquitectura y Stack Tecnológico

El sistema implementa una arquitectura **Cliente-Servidor desacoplada en 3 capas**:
- **Frontend SPA:** React 18 + Vite + CSS3 (Grid/Flexbox) con paleta institucional (Blanco `#ffffff`, Azul Rey `#1e3a8a`, Morado `#6d28d9`) e ilustraciones SVG vectoriales embebidas (`src/assets/imagenesJoyas.js`).
- **Backend API REST:** Node.js + Express.js con transacciones SQL ACID (`BEGIN` / `FOR UPDATE` / `COMMIT` / `ROLLBACK`).
- **Base de Datos Relacional:** PostgreSQL (`usuarios`, `productos`, `pedidos`, `detalle_pedidos`).
- **Pruebas Unitarias:** Vitest (`npm test`).

---

## Estructura del Repositorio

```text
secretodelbaul/
├── client/                         # Frontend React + Vite
│   ├── src/
│   │   ├── assets/imagenesJoyas.js # Ilustraciones SVG embebidas (Data URI)
│   │   ├── components/             # Auth, Catalogo, Checkout, Inventario, Rastreo
│   │   ├── tests/                  # Pruebas unitarias Vitest (Frontend)
│   │   ├── App.jsx                 # Enrutamiento por rol y Footer global
│   │   └── App.css                 # Estilos corporativos
├── server/                         # Backend API REST Express
│   ├── src/
│   │   ├── db.js                   # Conexión Pool PostgreSQL
│   │   └── index.js                # Endpoints REST y transacciones ACID
│   └── tests/                      # Pruebas unitarias Vitest (Backend)
├── .gitignore                      # Exclusión de .env y node_modules
└── README.md                       # Documentación técnica


## Comandos para subir los tests y el `README.md` a GitHub

Cuando guardes los archivos de prueba y el `README.md`, ejecuta en la raíz `secretodelbaul`:

git add .
git commit -m "Agrega pruebas unitarias con Vitest y README.md tecnico"
git push -u origin main

