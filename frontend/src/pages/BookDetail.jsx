import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import {
  Tag, User, Truck, Package, ArrowLeft,
  ShoppingCart, CheckCircle, AlertTriangle,
  XCircle, RotateCcw, BookOpen
} from 'lucide-react';

export default function BookDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => api.get(`/books/${id}`).then(r => r.data),
  });

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center text-amber-700">
      Loading…
    </div>
  );

  const book = data?.book;
  if (!book) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <BookOpen size={48} className="text-amber-300" />
      <h2 className="text-3xl font-bold text-stone-900">Book not found</h2>
      <Link to="/books" className="text-amber-600 hover:underline flex items-center gap-1">
        <ArrowLeft size={14} /> Back to books
      </Link>
    </div>
  );

  const outOfStock = book.stock === 0;
  const lowStock = book.stock > 0 && book.stock <= 5;

  const handleAdd = async () => {
    if (!user) return nav('/login');
    await addToCart(book._id, 1);
    toast.success(`"${book.title}" added to cart`);
  };

  return (
    <div className="min-h-screen bg-amber-50/40 px-4 sm:px-6 md:px-[6vw] py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">

        {/* ── Image ── */}
        <div className="md:sticky md:top-20">
          <div className="bg-amber-50 rounded-2xl p-4 sm:p-6 md:p-8 flex items-center justify-center border border-amber-100 min-h-[250px] sm:min-h-[350px] md:min-h-[400px]">
            <img
              src={book.image || 'https://via.placeholder.com/400x560?text=Book'}
              alt={book.title}
              className="
          w-full
          max-h-[280px]
          sm:max-h-[350px]
          md:max-h-[420px]
          object-contain
          rounded-lg
        "
            />
          </div>

          <div
            className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold border flex items-center gap-2
      ${outOfStock
                ? 'bg-red-50 border-red-200 text-red-700'
                : lowStock
                  ? 'bg-orange-50 border-orange-200 text-orange-700'
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}
          >
            {outOfStock ? (
              <>
                <XCircle size={16} /> Out of stock
              </>
            ) : lowStock ? (
              <>
                <AlertTriangle size={16} />
                Only {book.stock} copies left — order soon!
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                In stock — {book.stock} copies available
              </>
            )}
          </div>
        </div>

        {/* ── Details ── */}
        <div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-stone-900 leading-tight mb-3 break-words">
            {book.title}
          </h1>

          {/* Author */}
          <p className="text-stone-400 text-sm sm:text-base mb-6">
            by{' '}
            <span className="font-semibold text-stone-700">
              {book.author}
            </span>
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3 pb-6 mb-6 border-b border-amber-100">
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900">
              Rs.{book.price}
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">
              About this book
            </h3>

            <p className="text-stone-600 leading-relaxed font-light text-sm sm:text-base">
              {book.description ||
                'No description available for this title.'}
            </p>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              {
                icon: <Tag size={14} />,
                label: 'Category',
                val: book.category,
              },
              {
                icon: <User size={14} />,
                label: 'Author',
                val: book.author,
              },
              {
                icon: <Truck size={14} />,
                label: 'Payment',
                val: 'Cash on Delivery',
              },
            ].map(({ icon, label, val }) => (
              <div
                key={label}
                className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-sm flex items-center gap-2"
              >
                <span className="text-amber-600">{icon}</span>
                <span className="text-stone-400">{label}:</span>
                <span className="font-medium text-stone-800">{val}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className={`w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm transition-colors
          ${outOfStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 text-amber-50 hover:bg-amber-700'
                }`}
            >
              <ShoppingCart size={16} />
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <Link
              to="/books"
              className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3.5 rounded-full border border-amber-200 text-stone-700 text-sm font-medium hover:bg-amber-50 transition-colors no-underline"
            >
              <ArrowLeft size={15} />
              Back to Books
            </Link>
          </div>

          {/* Delivery note */}
          {!outOfStock && (
            <div className="mt-5 bg-amber-50 rounded-xl px-4 py-3 text-xs text-stone-500 flex flex-col sm:flex-row flex-wrap gap-3">
              <span className="flex items-center gap-1.5">
                <Package size={13} className="text-amber-600" />
                Free delivery over Rs. 2000
              </span>

              <span className="hidden sm:block">·</span>

              <span className="flex items-center gap-1.5">
                <Truck size={13} className="text-amber-600" />
                Pay on delivery
              </span>

              <span className="hidden sm:block">·</span>

              <span className="flex items-center gap-1.5">
                <RotateCcw size={13} className="text-amber-600" />
                Easy returns
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}