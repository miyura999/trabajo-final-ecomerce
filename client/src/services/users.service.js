import axios from 'axios';
import api from './api.service';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api"

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const usersService = {
  // Obtener todos los usuarios
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/users');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Error al obtener usuarios'
      };
    }
  },

  // Obtener un usuario por ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Error al obtener usuario'
      };
    }
  },

  // Crear nuevo usuario
  createUser: async (userData) => {
    try {
      const response = await apiClient.post('/users', userData);
      return {
        success: true,
        data: response.data.data,
        message: 'Usuario creado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Error al crear usuario'
      };
    }
  },

  // Actualizar usuario
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return {
        success: true,
        data: response.data.data,
        message: 'Usuario actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Error al actualizar usuario'
      };
    }
  },

  // Eliminar usuario
  deleteUser: async (userId) => {
    try {
      await apiClient.delete(`/users/${userId}`);
      return {
        success: true,
        message: 'Usuario eliminado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Error al eliminar usuario'
      };
    }
  },

  // Cambiar estado de usuario
  changeUserStatus: async (userId, estado) => {
    try {
      const response = await api.put(`/users/${userId}`, { estado });
      return {
        success: true,
        data: response.data.data,
        message: 'Estado actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        message: 'Error al cambiar estado'
      };
    }
  }
};

export default usersService;