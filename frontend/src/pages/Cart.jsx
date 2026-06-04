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
    } catch {} finally { setLoading(false); }
  };

  const updateQty = async (bookId, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) { toast.error(`Only ${stock} copies available`); return; }
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

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center text-amber-700">
      Loading cart…
    </div>
  );

  if (!cart.length) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-amber-50/40">
      <div className="text-6xl">🛒</div>
      <h2 className="text-3xl font-bold text-stone-900">Your cart is empty</h2>
      <p className="text-stone-400 text-sm">You haven't added any books yet.</p>
      <Link to="/books" className="bg-stone-900 text-amber-50 px-7 py-3 rounded-full font-medium text-sm hover:bg-amber-700 transition-colors">
        Browse Books →
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50/40 px-6 md:px-[6vw] py-12">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold tracking-widest uppercase mb-2">
          <div className="w-6 h-px bg-amber-600" /> Your selection
        </div>
        <h1 className="text-4xl font-bold text-stone-900">Shopping Cart</h1>
        <p className="text-stone-400 text-sm mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Items list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map(({ bookId: book, quantity }) => (
            <div key={book._id} className="bg-white rounded-2xl p-5 border border-amber-100 flex gap-4 items-center hover:shadow-md transition-shadow">

              <Link to={`/books/${book._id}`}>
                <img src={book.image || 'https://via.placeholder.com/80x100?text=Book'} alt={book.title}
                  className="w-16 h-20 object-cover rounded-lg shrink-0" />
              </Link>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-0.5">{book.category}</p>
                <Link to={`/books/${book._id}`} className="no-underline">
                  <h3 className="font-bold text-stone-900 truncate hover:text-amber-700 transition-colors">{book.title}</h3>
                </Link>
                <p className="text-xs text-stone-400 mt-0.5">{book.author}</p>
                <p className="font-bold text-stone-900 mt-1">${book.price}</p>
                {book.stock === 0 && <p className="text-xs text-red-600 font-semibold mt-1">❌ Out of stock</p>}
                {book.stock > 0 && book.stock <= 5 && <p className="text-xs text-orange-600 font-semibold mt-1">⚡ Only {book.stock} left</p>}
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => updateQty(book._id, quantity - 1, book.stock)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg border border-amber-200 font-bold text-stone-700 hover:bg-stone-900 hover:text-white disabled:opacity-30 transition-all">
                  −
                </button>
                <span className="w-7 text-center font-semibold text-sm">{quantity}</span>
                <button onClick={() => updateQty(book._id, quantity + 1, book.stock)}
                  disabled={quantity >= book.stock}
                  className="w-8 h-8 rounded-lg border border-amber-200 font-bold text-stone-700 hover:bg-stone-900 hover:text-white disabled:opacity-30 transition-all">
                  +
                </button>
              </div>

              <p className="font-bold text-stone-900 text-sm w-16 text-right shrink-0">
                ${(book.price * quantity).toFixed(2)}
              </p>

              <button onClick={() => removeItem(book._id)}
                className="text-amber-300 hover:text-red-500 transition-colors text-lg shrink-0 bg-none border-none cursor-pointer">
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl p-6 border border-amber-100 sticky top-20">
          <h2 className="font-bold text-stone-900 text-lg mb-5">Order Summary</h2>

          <div className="flex flex-col gap-3 mb-5">
            {cart.map(({ bookId: book, quantity }) => (
              <div key={book._id} className="flex justify-between text-sm">
                <span className="text-stone-400 truncate max-w-[160px]">{book.title} × {quantity}</span>
                <span className="font-medium text-stone-800">${(book.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-amber-100 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-400">Subtotal</span>
              <span className="text-2xl font-bold text-stone-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-stone-400">Delivery</span>
              <span className={`text-xs font-medium ${total >= 30 ? 'text-green-600' : 'text-stone-400'}`}>
                {total >= 30 ? '✓ Free' : 'At checkout'}
              </span>
            </div>
          </div>

          <Link to="/checkout"
            className="block text-center bg-stone-900 text-amber-50 py-3.5 rounded-full font-medium text-sm hover:bg-amber-700 transition-colors no-underline">
            Proceed to Checkout →
          </Link>
          <Link to="/books"
            className="block text-center mt-3 text-xs text-amber-600 hover:underline no-underline">
            ← Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}