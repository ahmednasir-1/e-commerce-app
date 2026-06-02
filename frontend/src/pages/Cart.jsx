// frontend/src/pages/Cart.jsx
import { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data.cart);
    } catch {}
    finally { setLoading(false); }
  };

  // Update quantity with stock check on frontend too
  const updateQty = async (bookId, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) {
      toast.error(`Only ${stock} copies available`);
      return;
    }
    try {
      const { data } = await api.put('/cart/update', { bookId, quantity: newQty });
      setCart(data.cart);
    } catch {}
  };

  const removeItem = async (bookId) => {
    try {
      const { data } = await api.delete(`/cart/remove/${bookId}`);
      setCart(data.cart);
      toast.success('Item removed');
    } catch {}
  };

  const total = cart.reduce((sum, i) => sum + i.bookId.price * i.quantity, 0);

  if (loading) return <p className="text-center mt-10">Loading cart…</p>;
  if (!cart.length) return (
    <div className="text-center mt-16">
      <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
      <Link to="/books" className="bg-indigo-600 text-white px-5 py-2 rounded">
        Browse Books
      </Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.map(({ bookId: book, quantity }) => (
          <div key={book._id} className="bg-white shadow rounded-lg p-4 flex gap-4 items-center">
            <img src={book.image} alt={book.title} className="w-16 h-20 object-cover rounded" />

            <div className="flex-1">
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-500">{book.author}</p>
              <p className="text-indigo-600 font-bold mt-1">${book.price}</p>

              {/* ── Stock warnings ── */}
              {book.stock === 0 && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  ❌ Out of stock — remove this item to proceed
                </p>
              )}
              {book.stock > 0 && book.stock <= 5 && (
                <p className="text-xs text-orange-500 font-semibold mt-1 animate-pulse">
                  ⚡ Hurry! Only {book.stock} left in stock
                </p>
              )}
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(book._id, quantity - 1, book.stock)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded border text-lg font-bold disabled:opacity-40 hover:bg-gray-100"
              >
                −
              </button>

              <span className="w-8 text-center font-semibold">{quantity}</span>

              <button
                onClick={() => updateQty(book._id, quantity + 1, book.stock)}
                disabled={quantity >= book.stock} // ← blocked at stock limit
                className="w-8 h-8 rounded border text-lg font-bold disabled:opacity-40 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            {/* Line total */}
            <p className="w-20 text-right font-bold">
              ${(book.price * quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(book._id)}
              className="text-red-400 hover:text-red-600 text-xl ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Total + Checkout */}
      <div className="bg-white shadow rounded-lg p-4 mt-6 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</p>
        </div>
        <Link
          to="/checkout"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}