// Validadores para formularios

export const validators = {
  // Validar campo requerido
  required: (message = 'Este campo es requerido') => (value) => {
    if (!value || value.toString().trim() === '') {
      return message;
    }
    return '';
  },

  // Validar email
  email: (message = 'Email inválido') => (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return message;
    }
    return '';
  },

  // Validar longitud mínima
  minLength: (min, message) => (value) => {
    if (value && value.length < min) {
      return message || `Debe tener al menos ${min} caracteres`;
    }
    return '';
  },

  // Validar longitud máxima
  maxLength: (max, message) => (value) => {
    if (value && value.length > max) {
      return message || `No puede exceder ${max} caracteres`;
    }
    return '';
  },

  // Validar valor mínimo
  min: (min, message) => (value) => {
    if (value !== '' && Number(value) < min) {
      return message || `El valor mínimo es ${min}`;
    }
    return '';
  },

  // Validar valor máximo
  max: (max, message) => (value) => {
    if (value !== '' && Number(value) > max) {
      return message || `El valor máximo es ${max}`;
    }
    return '';
  },

  // Validar número
  number: (message = 'Debe ser un número válido') => (value) => {
    if (value && isNaN(Number(value))) {
      return message;
    }
    return '';
  },

  // Validar contraseña segura
  password: (message = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número') => (value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (value && !passwordRegex.test(value)) {
      return message;
    }
    return '';
  },

  // Validar que dos campos coincidan
  match: (fieldName, message) => (value, allValues) => {
    if (value !== allValues[fieldName]) {
      return message || `No coincide con ${fieldName}`;
    }
    return '';
  },

  // Validar URL
  url: (message = 'URL inválida') => (value) => {
    if (!value) return '';
    try {
      new URL(value);
      return '';
    } catch {
      return message;
    }
  },

  // Validar teléfono (formato colombiano)
  phone: (message = 'Teléfono inválido') => (value) => {
    const phoneRegex = /^(\+57)?[\s]?3[\d]{9}$/;
    if (value && !phoneRegex.test(value)) {
      return message;
    }
    return '';
  },

  // Componer múltiples validadores
  compose: (...validators) => (value, allValues) => {
    for (const validator of validators) {
      const error = validator(value, allValues);
      if (error) return error;
    }
    return '';
  }
};