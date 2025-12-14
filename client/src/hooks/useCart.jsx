import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar carrito al montar el componente
  useEffect(() => {
    loadCart();

      return () => {
    setCartItems([]);
  };
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/cart');
      
      // El backend devuelve el carrito con items populados
      const cart = response.data?.data;
      const items = cart?.items || [];
      
      setCartItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      // No mostrar toast aquí porque puede ser que el carrito no exista aún (primera vez)
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, cantidad = 1) => {
    try {
      setLoading(true);
      
      // Llamar a la API con los campos correctos que espera el backend
      const response = await axios.post('/cart/items', {
        productId: product._id,
        cantidad: cantidad
      });

      if (response.data?.success) {
        toast.success('Producto agregado al carrito');
        
        // Recargar el carrito para tener los datos actualizados del backend
        await loadCart();
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      
      // Manejar diferentes tipos de errores
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Error al agregar al carrito';
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      
      const response = await axios.delete(`/cart/items/${itemId}`);
      
      if (response.data?.success) {
        toast.success('Producto eliminado del carrito');
        
        // Actualizar estado local
        setCartItems(prevItems => 
          prevItems.filter(item => item._id !== itemId)
        );
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Error al eliminar del carrito';
      
      toast.error(errorMessage);
      await loadCart(); // Recargar en caso de error
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, cantidad) => {
    if (cantidad <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.put(`/cart/items/${itemId}`, {
        cantidad: cantidad
      });

      if (response.data?.success) {
        toast.success('Cantidad actualizada');
        
        // Actualizar estado local
        setCartItems(prevItems =>
          prevItems.map(item =>
            item._id === itemId
              ? { ...item, cantidad, subtotal: item.precio * cantidad }
              : item
          )
        );
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Error al actualizar cantidad';
      
      toast.error(errorMessage);
      await loadCart(); // Recargar en caso de error
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      
      const response = await axios.delete('/cart/clear');
      
      if (response.data?.success) {
        toast.success('Carrito vaciado');
        setCartItems([]);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Error al vaciar el carrito';
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    
    return cartItems.reduce((total, item) => {
      return total + (item.subtotal || 0);
    }, 0);
  };

  const getItemCount = () => {
    if (!Array.isArray(cartItems)) return 0;
    
    return cartItems.reduce((count, item) => count + (item.cantidad || 0), 0);
  };

  const isInCart = (productId) => {
    if (!Array.isArray(cartItems)) return false;
    return cartItems.some(item => 
      item.producto?._id === productId || item.producto === productId
    );
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    isInCart,
    itemCount: getItemCount()
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};