// Utilidades para formatear datos

/**
 * Formatea un número como precio en pesos colombianos
 * @param {number} price - Precio a formatear
 * @returns {string} - Precio formateado
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Formatea una fecha
 * @param {string|Date} date - Fecha a formatear
 * @param {string} format - Tipo de formato ('short', 'long', 'numeric')
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date, format = 'long') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const formats = {
    short: { month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    numeric: { year: 'numeric', month: '2-digit', day: '2-digit' },
    time: { hour: '2-digit', minute: '2-digit' },
    full: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  };

  return new Intl.DateTimeFormat('es-CO', formats[format] || formats.long).format(dateObj);
};

/**
 * Formatea un número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {string} - Teléfono formateado
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} - Texto truncado
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} text - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 */
export const capitalizeWords = (text) => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Formatea un número con separadores de miles
 * @param {number} number - Número a formatear
 * @returns {string} - Número formateado
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('es-CO').format(number);
};

/**
 * Calcula el tiempo transcurrido desde una fecha
 * @param {string|Date} date - Fecha
 * @returns {string} - Tiempo transcurrido
 */
export const timeAgo = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((new Date() - dateObj) / 1000);

  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
    segundo: 1
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    
    if (interval >= 1) {
      return `Hace ${interval} ${unit}${interval !== 1 ? 's' : ''}`;
    }
  }

  return 'Justo ahora';
};

/**
 * Genera iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} - Iniciales
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Formatea el tamaño de un archivo
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} - Tamaño formateado
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Sanitiza un string para usar como slug
 * @param {string} text - Texto a convertir
 * @returns {string} - Slug
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

