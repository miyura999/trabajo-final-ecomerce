import { useState, useEffect, createContext, useContext } from 'react';
import api from '../services/api.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

      const { data } = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Aquí guardamos el primer usuario (solo de ejemplo)
      const user = data.data[0]; // porque tu backend devuelve { data: [] }

      setUser(user);
      setIsAuthenticated(true);
      console.log("jajajajjaja",isAuthenticated);
      

    } catch (err) {
      console.log("Error autenticación:", err);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      console.log("what");
      
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
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setIsAuthenticated(true);
    alert("Inicio de sesión exitoso");
    return true

  } catch (error) {
    alert(error.response?.data?.message || "Error en el login");
    console.log("malo malito", error);
    
    setIsAuthenticated(false);
    return; // Para no ejecutar nada más
  }
};

  const register = (userData) => {
    // Simulación de registro
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'cliente'
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', 'mock-jwt-token');
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