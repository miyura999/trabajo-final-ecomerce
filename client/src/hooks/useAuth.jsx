import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token){
      setIsAuthenticated(false)
    }

    try {
      const decoded = jwtDecode(token)
      setUser(decoded)
    } catch (error) {
      setIsAuthenticated(false)
    }
  }, [])


  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      
      // Verificar respuesta exitosa
      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data;

        // Guardar tokens y usuario en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Configurar token en axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(user);
        setIsAuthenticated(true);

        return { success: true, user };
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Error al iniciar sesión' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      
      // Verificar respuesta exitosa
      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data;

        // Guardar tokens y usuario en localStorage
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(user));
        
        // Configurar token en axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(user);
        setIsAuthenticated(true);

        return { success: true, user };
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Error al registrarse' 
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al registrarse' 
      };
    }
  };

  const logout = () => {
    // Limpiar todos los datos de autenticación
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post('/auth/refresh-token', { refreshToken });
      
      if (response.data.success) {
        const { token } = response.data.data;
        
        // Actualizar token
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { success: true };
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Si falla el refresh, hacer logout
      logout();
      return { success: false };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    refreshAccessToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};