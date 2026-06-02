import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  const outOfStock = book.stock === 0;
  const lowStock = book.stock > 0 && book.stock <= 5;

  const handleAdd = async () => {
    if (!user) return nav('/login');
    if (outOfStock) return; // extra safety guard

    await addToCart(book._id, 1);
    toast.success('Added to cart');
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex flex-col">

      {/* Image + stock badge */}
      <Link to={`/books/${book._id}`} className="relative">
        <img
          src={book.image || 'https://via.placeholder.com/300x400?text=Book'}
          alt={book.title}
          className={`w-full h-56 object-cover ${outOfStock ? 'opacity-60' : ''}`}
        />

        {/* Out of stock overlay */}
        {outOfStock && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </span>
        )}

        {/* Low stock warning — only show if not out of stock */}
        {lowStock && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
            ⚡ Only {book.stock} left!
          </span>
        )}
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <span className="text-xs text-indigo-600 font-semibold">
          {book.category}
        </span>

        <Link
          to={`/books/${book._id}`}
          className="font-semibold mt-1 line-clamp-1 hover:underline"
        >
          {book.title}
        </Link>

        <p className="text-sm text-slate-500">{book.author}</p>

        {/* Hurry up text below author */}
        {lowStock && (
          <p className="text-xs text-orange-500 font-medium mt-1 animate-pulse">
            Hurry! Only {book.stock} items left
          </p>
        )}

        <div className="mt-auto flex justify-between items-center pt-3">
          <span className="font-bold text-lg">${book.price}</span>

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`px-3 py-1.5 rounded text-sm transition
              ${outOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
          >
            {outOfStock ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}