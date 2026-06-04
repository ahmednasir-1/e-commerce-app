import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <nav className="bg-white border-b border-amber-200/50 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        <Link to="/" className="font-serif text-xl font-black tracking-tight text-stone-900 no-underline">
          Book<span className="text-amber-600">Haven</span>
        </Link>

        <div className="flex items-center gap-5 text-sm">

          <NavLink to="/books"
            className={({ isActive }) =>
              `font-medium transition-colors no-underline ${isActive ? 'text-amber-600' : 'text-stone-400 hover:text-amber-600'}`}>
            Books
          </NavLink>

          {user && (
            <NavLink to="/cart"
              className={({ isActive }) =>
                `font-medium flex items-center gap-1.5 transition-colors no-underline ${isActive ? 'text-amber-600' : 'text-stone-400 hover:text-amber-600'}`}>
              🛒 Cart
              {count > 0 && (
                <span className="bg-amber-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </NavLink>
          )}

          {user && (
            <NavLink to="/my-orders"
              className={({ isActive }) =>
                `font-medium transition-colors no-underline ${isActive ? 'text-amber-600' : 'text-stone-400 hover:text-amber-600'}`}>
              My Orders
            </NavLink>
          )}

          {user?.role === 'admin' && (
            <NavLink to="/admin"
              className="text-xs font-medium text-purple-700 border border-purple-200 px-3 py-1 rounded-md hover:bg-purple-50 transition-colors no-underline">
              Admin
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink to="/login"
                className="font-medium text-stone-400 hover:text-amber-600 transition-colors no-underline">
                Login
              </NavLink>
              <NavLink to="/signup"
                className="bg-stone-900 text-amber-50 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors no-underline">
                Sign up
              </NavLink>
            </>
          ) : (
            <button onClick={logout}
              className="text-sm font-medium text-stone-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}