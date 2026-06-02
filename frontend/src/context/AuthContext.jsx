import { createContext, useContext, useEffect, useReducer } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.payload, loading: false };
    case 'LOGOUT': return { user: null, loading: false };
    default: return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { user: null, loading: true });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return dispatch({ type: 'SET_USER', payload: null });
    api.get('/auth/me').then(r => dispatch({ type: 'SET_USER', payload: r.data.user }))
      .catch(() => dispatch({ type: 'LOGOUT' }));
  }, []);

  
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    dispatch({ type: 'SET_USER', payload: data.user });
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    localStorage.setItem('token', data.token);
    dispatch({ type: 'SET_USER', payload: data.user });
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return <AuthContext.Provider value={{ ...state, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
