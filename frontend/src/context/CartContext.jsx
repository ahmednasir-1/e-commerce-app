import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  const refresh = async () => {
    if (!user) return setCart([]);
    const { data } = await api.get('/cart');
    setCart(data.cart || []);
  };

  useEffect(() => { refresh(); }, [user]);

  // Add to cart button
  const addToCart = async (bookId, quantity = 1) => {
    const { data } = await api.post('/cart/add', { bookId, quantity });
    setCart(data.cart);
  };


  const update = async (bookId, quantity) => {
    const { data } = await api.put('/cart/update', { bookId, quantity });
    setCart(data.cart);
  };


  const remove = async (bookId) => {
    const { data } = await api.delete(`/cart/remove/${bookId}`);
    setCart(data.cart);
  };

  const clear = async () => { 
    await api.delete('/cart/clear'); 
    setCart([]); 
  };

  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const total = cart.reduce((s, i) => s + (i.bookId?.price || 0) * i.quantity, 0);

  return <CartContext.Provider value={{ cart, count, total, addToCart, update, remove, clear, refresh }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
