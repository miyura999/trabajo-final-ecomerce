# 🛒 E-Commerce Backend API

API REST completa para sistema de e-commerce desarrollada con Node.js, Express.js y MongoDB.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)

## ✨ Características

- ✅ Autenticación y autorización con JWT
- ✅ Gestión de usuarios con roles (Admin/Cliente)
- ✅ CRUD completo de productos
- ✅ Carrito de compras funcional
- ✅ Sistema de pedidos con estados
- ✅ Validación de datos con express-validator
- ✅ Manejo centralizado de errores
- ✅ Búsqueda y filtrado de productos
- ✅ Relaciones entre entidades
- ✅ Código modular y escalable

## 📋 Requisitos

- Node.js v14 o superior
- MongoDB v4 o superior
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
cd ecommerce-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=tu_clave_refresh_aqui
JWT_REFRESH_EXPIRE=7d
```

4. **Iniciar el servidor**

**Modo desarrollo:**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará corriendo en `http://localhost:5000`

## 🔑 Usuarios de Prueba

Al iniciar la aplicación por primera vez, se crea automáticamente:

**Usuario Administrador:**
- Email: `admin@ecommerce.com`
- Password: `admin123`

**Para crear un cliente:**
Usa el endpoint `POST /api/auth/register`

## 📚 Endpoints

### 🔐 Autenticación

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Registrar nuevo usuario | Público |
| POST | `/api/auth/login` | Iniciar sesión | Público |

**Ejemplo - Registro:**
```json
POST /api/auth/register
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "123456",
  "telefono": "1234567890"
}
```

**Ejemplo - Login:**
```json
POST /api/auth/login
{
  "email": "juan@ejemplo.com",
  "password": "123456"
}
```

### 👥 Usuarios

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/users` | Listar todos los usuarios | Admin |
| GET | `/api/users/:id` | Obtener usuario por ID | Admin |
| GET | `/api/users/profile/me` | Obtener perfil actual | Autenticado |
| PUT | `/api/users/:id` | Actualizar usuario | Admin |
| DELETE | `/api/users/:id` | Eliminar usuario | Admin |

### 📦 Productos

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/products` | Listar productos | Público |
| GET | `/api/products/:id` | Obtener producto por ID | Público |
| POST | `/api/products` | Crear producto | Admin |
| PUT | `/api/products/:id` | Actualizar producto | Admin |
| DELETE | `/api/products/:id` | Eliminar producto | Admin |

**Filtros disponibles en GET /api/products:**
- `?search=texto` - Búsqueda por texto
- `?categoria=nombre` - Filtrar por categoría
- `?minPrecio=100` - Precio mínimo
- `?maxPrecio=500` - Precio máximo
- `?estado=disponible` - Filtrar por estado

**Ejemplo - Crear producto:**
```json
POST /api/products
Authorization: Bearer {token}
{
  "nombre": "Laptop HP",
  "descripcion": "Laptop HP Core i5 8GB RAM",
  "precio": 799.99,
  "categoria": "Electrónica",
  "stock": 10,
  "imagen": "https://ejemplo.com/imagen.jpg"
}
```

### 🛒 Carrito

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/cart` | Obtener carrito | Cliente |
| POST | `/api/cart/items` | Agregar producto al carrito | Cliente |
| PUT | `/api/cart/items/:id` | Actualizar cantidad | Cliente |
| DELETE | `/api/cart/items/:id` | Eliminar producto | Cliente |
| DELETE | `/api/cart/clear` | Vaciar carrito | Cliente |

**Ejemplo - Agregar al carrito:**
```json
POST /api/cart/items
Authorization: Bearer {token}
{
  "productId": "64abc123def456789",
  "cantidad": 2
}
```

### 📋 Pedidos

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/orders` | Listar pedidos | Autenticado |
| GET | `/api/orders/:id` | Obtener pedido por ID | Autenticado |
| POST | `/api/orders` | Crear pedido | Cliente |
| PATCH | `/api/orders/:id/status` | Actualizar estado | Admin |

**Estados de pedido:**
- `pendiente` → `en_produccion` → `enviando` → `entregado`
- `cancelado` (desde cualquier estado excepto entregado)

**Ejemplo - Crear pedido:**
```json
POST /api/orders
Authorization: Bearer {token}
{
  "direccionEnvio": {
    "calle": "Calle Principal 123",
    "ciudad": "Medellín",
    "codigoPostal": "050001",
    "pais": "Colombia"
  },
  "telefono": "3001234567"
}
```

**Ejemplo - Actualizar estado:**
```json
PATCH /api/orders/64abc123def456789/status
Authorization: Bearer {token-admin}
{
  "estado": "en_produccion"
}
```

## 📁 Estructura del Proyecto
```
ecommerce-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración MongoDB
│   │   ├── initRoles.js         # Inicialización de roles
│   │   └── initAdmin.js         # Creación de admin
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── cart.controller.js
│   │   └── order.controller.js
│   ├── helpers/
│   │   ├── bcrypt.helper.js     # Funciones de bcrypt
│   │   ├── jwt.helper.js        # Funciones de JWT
│   │   └── response.helper.js   # Respuestas estandarizadas
│   ├── middlewares/
│   │   ├── auth.middleware.js   # Autenticación
│   │   ├── roles.middleware.js  # Autorización
│   │   ├── validation.middleware.js
│   │   └── errorHandler.middleware.js
│   ├── models/
│   │   ├── Role.model.js
│   │   ├── User.model.js
│   │   ├── Product.model.js
│   │   ├── Cart.model.js
│   │   ├── CartItem.model.js
│   │   ├── Order.model.js
│   │   └── OrderItem.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   └── order.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   └── order.service.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── product.validator.js
│   │   ├── cart.validator.js
│   │   └── order.validator.js
│   └── app.js                   # Archivo principal
├── .env                         # Variables de entorno
├── .env.example                 # Ejemplo de variables
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Tecnologías

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Hash de contraseñas
- **express-validator** - Validación de datos
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno

## 🧪 Pruebas

Puedes probar la API usando:

- **Postman** - Importa la colección (si está disponible)
- **Thunder Client** - Extensión de VS Code
- **curl** - Desde la terminal

**Ejemplo con curl:**
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecommerce.com","password":"admin123"}'

# Listar productos
curl http://localhost:5000/api/products
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Validación de datos en todas las entradas
- Autorización basada en roles
- Variables de entorno para datos sensibles

## 📝 Notas Importantes

1. **Cambiar credenciales del admin** después del primer inicio
2. **Usar HTTPS** en producción
3. **Configurar CORS** apropiadamente para producción
4. **Hacer backup** regular de la base de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Tu Nombre - [tu@email.com](mailto:tu@email.com)

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub