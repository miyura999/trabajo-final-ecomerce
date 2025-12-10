// Constantes de la aplicación

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'cliente'
};

// Estados de pedidos
export const ORDER_STATUS = {
  PENDING: 'Pendiente',
  IN_PRODUCTION: 'En Producción',
  SHIPPING: 'Enviando',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado'
};

// Lista de estados de pedidos
export const ORDER_STATUS_LIST = [
  { value: ORDER_STATUS.PENDING, label: 'Pendiente' },
  { value: ORDER_STATUS.IN_PRODUCTION, label: 'En Producción' },
  { value: ORDER_STATUS.SHIPPING, label: 'Enviando' },
  { value: ORDER_STATUS.DELIVERED, label: 'Entregado' },
  { value: ORDER_STATUS.CANCELLED, label: 'Cancelado' }
];

// Categorías de productos
export const PRODUCT_CATEGORIES = [
  'Laptops',
  'Smartphones',
  'Tablets',
  'Accesorios',
  'Gaming',
  'Audio',
  'Cámaras',
  'Smartwatch',
  'Monitores',
  'Teclados',
  'Mouse',
  'Almacenamiento'
];

// Opciones de ordenamiento
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'name-asc', label: 'Nombre: A-Z' },
  { value: 'name-desc', label: 'Nombre: Z-A' },
  { value: 'rating', label: 'Mejor valorados' }
];

// Rangos de precio
export const PRICE_RANGES = [
  { min: 0, max: 100000, label: 'Menos de $100.000' },
  { min: 100000, max: 500000, label: '$100.000 - $500.000' },
  { min: 500000, max: 1000000, label: '$500.000 - $1.000.000' },
  { min: 1000000, max: 2000000, label: '$1.000.000 - $2.000.000' },
  { min: 2000000, max: null, label: 'Más de $2.000.000' }
];

// Métodos de pago
export const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Tarjeta de Crédito', icon: '💳' },
  { value: 'debit_card', label: 'Tarjeta Débito', icon: '💳' },
  { value: 'pse', label: 'PSE', icon: '🏦' },
  { value: 'cash', label: 'Efectivo', icon: '💵' },
  { value: 'nequi', label: 'Nequi', icon: '📱' },
  { value: 'daviplata', label: 'Daviplata', icon: '📱' }
];

// Opciones de envío
export const SHIPPING_OPTIONS = [
  { value: 'standard', label: 'Envío Estándar (3-5 días)', price: 10000 },
  { value: 'express', label: 'Envío Express (1-2 días)', price: 20000 },
  { value: 'free', label: 'Envío Gratis (Compras +$100.000)', price: 0, minPurchase: 100000 }
];

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48]
};

// Mensajes de error
export const ERROR_MESSAGES = {
  GENERIC: 'Ha ocurrido un error. Por favor intenta de nuevo.',
  NETWORK: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no existe.',
  VALIDATION: 'Por favor verifica los datos ingresados.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  LOGIN: 'Inicio de sesión exitoso',
  REGISTER: 'Registro exitoso',
  LOGOUT: 'Sesión cerrada correctamente',
  PRODUCT_ADDED: 'Producto agregado al carrito',
  PRODUCT_REMOVED: 'Producto eliminado del carrito',
  ORDER_CREATED: 'Pedido creado exitosamente',
  PROFILE_UPDATED: 'Perfil actualizado correctamente',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente'
};

// Configuración del carrito
export const CART_CONFIG = {
  MAX_QUANTITY_PER_ITEM: 10,
  FREE_SHIPPING_THRESHOLD: 100000,
  TAX_RATE: 0.19 // 19% IVA
};

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  MY_ORDERS: '/my-orders',
  ORDER_DETAIL: '/orders/:id',
  PROFILE: '/profile',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users'
};

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Configuración de imágenes
export const IMAGE_CONFIG = {
  PLACEHOLDER: '/placeholder-product.jpg',
  MAX_SIZE: 5242880, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
};

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+57)?[\s]?3[\d]{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  URL: /^https?:\/\/.+/
};