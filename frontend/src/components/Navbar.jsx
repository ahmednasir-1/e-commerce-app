import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { ShoppingCart, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white border-b border-amber-200/50 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="font-serif text-xl font-black tracking-tight text-stone-900 no-underline"
        >
          Book<span className="text-amber-600">Haven</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5 text-sm">
          <NavLink
            to="/books"
            className={({ isActive }) =>
              `font-medium transition-colors no-underline ${
                isActive
                  ? "text-amber-600"
                  : "text-stone-400 hover:text-amber-600"
              }`
            }
          >
            Books
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `font-medium flex items-center gap-1.5 transition-colors no-underline ${
                    isActive
                      ? "text-amber-600"
                      : "text-stone-400 hover:text-amber-600"
                  }`
                }
              >
                <ShoppingCart size={15} />
                Cart
                {count > 0 && (
                  <span className="bg-amber-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/my-orders"
                className={({ isActive }) =>
                  `font-medium transition-colors no-underline ${
                    isActive
                      ? "text-amber-600"
                      : "text-stone-400 hover:text-amber-600"
                  }`
                }
              >
                My Orders
              </NavLink>
            </>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className="text-xs font-medium text-purple-700 border border-purple-200 px-3 py-1 rounded-md hover:bg-purple-50 transition-colors no-underline"
            >
              Admin
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink
                to="/login"
                className="font-medium text-stone-400 hover:text-amber-600 transition-colors no-underline"
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className="bg-stone-900 text-amber-50 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors no-underline"
              >
                Sign up
              </NavLink>
            </>
          ) : (
            <button
              onClick={logout}
              className="text-sm font-medium text-stone-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-stone-700"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-amber-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm">
          <NavLink
            to="/books"
            onClick={closeMenu}
            className="font-medium text-stone-600 hover:text-amber-600 no-underline"
          >
            Books
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/cart"
                onClick={closeMenu}
                className="flex items-center gap-2 font-medium text-stone-600 hover:text-amber-600 no-underline"
              >
                <ShoppingCart size={16} />
                Cart
                {count > 0 && (
                  <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/my-orders"
                onClick={closeMenu}
                className="font-medium text-stone-600 hover:text-amber-600 no-underline"
              >
                My Orders
              </NavLink>
            </>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              onClick={closeMenu}
              className="font-medium text-purple-700 no-underline"
            >
              Admin
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink
                to="/login"
                onClick={closeMenu}
                className="font-medium text-stone-600 hover:text-amber-600 no-underline"
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                onClick={closeMenu}
                className="bg-stone-900 text-white text-center py-2 rounded-full no-underline"
              >
                Sign up
              </NavLink>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              className="text-left text-red-500 bg-transparent border-none"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}