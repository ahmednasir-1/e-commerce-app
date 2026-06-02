import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-700">📚 BookStore</Link>
        <div className="flex items-center gap-4 text-sm">
          <NavLink to="/books" className="hover:text-indigo-600">Books</NavLink>
          {user && <NavLink to="/cart" className="hover:text-indigo-600">Cart ({count})</NavLink>}
          {user && <NavLink to="/my-orders" className="hover:text-indigo-600">My Orders</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className="text-purple-600 hover:text-purple-800">Admin</NavLink>}
          {!user ? (
            <>
              <NavLink to="/login" className="hover:text-indigo-600">Login</NavLink>
              <NavLink to="/signup" className="bg-indigo-600 text-white px-3 py-1.5 rounded">Sign up</NavLink>
            </>
          ) : (
            <button onClick={logout} className="text-slate-600 hover:text-red-600">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}
