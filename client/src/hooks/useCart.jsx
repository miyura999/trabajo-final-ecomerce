import axios from 'axios';
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartId, setCartId] = useState(null);

  // Cargar carrito al montar el componente (opcional)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/cart');
      
      if (response.data.success) {
        const cart = response.data.data;
        setCartId(cart._id);
        setCartItems(cart.items.map(item => ({
          ...item.producto,
          quantity: item.cantidad,
          cartItemId: item._id,
          precio: item.precio,
          subtotal: item.subtotal
        })));
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      // Si el error es por autenticación, limpiar el carrito
      if (error.response?.status === 401) {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      const response = await axios.post('/cart/items', {
        productId: product._id,
        cantidad: quantity
      });

      if (response.data.success) {
        await fetchCart();
        toast.success(`${product.nombre} agregado al carrito`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al agregar producto al carrito';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      console.error('Error al agregar al carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/cart/items/${cartItemId}`);

      if (response.data.success) {
        await fetchCart();
        toast.info('Producto eliminado del carrito', {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar producto';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      console.error('Error al eliminar del carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`/cart/items/${cartItemId}`, {
        cantidad: quantity
      });

      if (response.data.success) {
        await fetchCart();
        toast.success('Cantidad actualizada', {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar cantidad';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      console.error('Error al actualizar cantidad:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      // ✅ CORRECCIÓN: La ruta correcta es /cart/clear
      const response = await axios.delete('/cart/clear');

      if (response.data.success) {
        setCartItems([]);
        setCartId(null);
        toast.success('Carrito vaciado exitosamente', {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al vaciar el carrito';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      console.error('Error al vaciar el carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.precio * item.quantity);
    }, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  const value = {
    cartItems,
    setCartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    isInCart,
    itemCount: getItemCount(),
    refreshCart: fetchCart
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