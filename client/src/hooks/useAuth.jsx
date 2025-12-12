import { useState, useEffect, createContext, useContext } from 'react';
import api from '../services/api.service';
import { toast } from 'react-toastify';
import { Zoom } from 'react-toastify/unstyled';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const { data } = await api.post("/auth/check-auth", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Aquí guardamos el primer usuario (solo de ejemplo)
        const user = data.data;
        setUser(user);
        setIsAuthenticated(true)

      } catch (err) {
        console.log("Error autenticación:", err);
        localStorage.removeItem("token");
        setIsAuthenticated(false);

      }

      setLoading(false);
    };

    checkAuth();
  }, []);


  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      // Ver token recibido
      console.log("Login:", res.data);

      // Guarda token
      localStorage.setItem("token", res.data.data.token);

      // Guarda usuario opcionalmente
      setUser(res.data.data.user);
      setIsAuthenticated(true);
      return true

    } catch (error) {
      toast.error('Datos inválidos!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Zoom,
      });

      setIsAuthenticated(false);
      return; // Para no ejecutar nada más
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.status === 201) {
        toast.success('cuenta creada!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Zoom,
        });
        new Promise((resolve) => setTimeout(resolve, 1500)); // Esperar 1.5 segundos
        return true
      }

    } catch (error) {

      toast.error('Error al crear la cuenta!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Zoom,
      });
      return false
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};