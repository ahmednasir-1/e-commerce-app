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
    if (!user) 
      return nav('/login');

    if (outOfStock) 
      return;
    
    await addToCart(book._id, 1);
    toast.success(`"${book.title}" added to cart`);
  };

  return (
    <div className="bg-white rounded-xl border border-amber-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200">

      {/* Image */}
      <Link to={`/books/${book._id}`} className="relative block">
        <img
          src={book.image || 'https://via.placeholder.com/300x400?text=Book'}
          alt={book.title}
          className={`w-full h-52 object-cover ${outOfStock ? 'opacity-50' : ''}`}
        />

        {outOfStock && (
          <span className="absolute top-2 left-2 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-md">
            Out of Stock
          </span>
        )}

        {lowStock && (
          <span className="absolute top-2 left-2 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-md animate-pulse">
            ⚡ Only {book.stock} left!
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">

        <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          {book.category}
        </span>

        <Link to={`/books/${book._id}`}
          className="font-bold text-stone-900 mt-1 line-clamp-1 hover:text-amber-600 transition-colors text-base no-underline">
          {book.title}
        </Link>

        <p className="text-xs text-stone-400 mt-0.5">{book.author}</p>

        {lowStock && (
          <p className="text-xs text-orange-500 font-medium mt-1">
            Hurry! Only {book.stock} items left
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-amber-50 flex justify-between items-center">
          <span className="text-lg font-bold text-stone-900">
            ${book.price}
          </span>

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
              ${outOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 text-amber-50 hover:bg-amber-700'}`}>
            {outOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}