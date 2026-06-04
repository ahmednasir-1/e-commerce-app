import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

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
    <div className="min-h-[60vh] flex items-center justify-center text-amber-700">Loading…</div>
  );

  const book = data?.book;
  if (!book) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="text-5xl">📚</div>
      <h2 className="text-3xl font-bold text-stone-900">Book not found</h2>
      <Link to="/books" className="text-amber-600 hover:underline">← Back to books</Link>
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
    <div className="min-h-screen bg-amber-50/40 px-6 md:px-[6vw] py-12">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-400 mb-8">
        <Link to="/" className="text-amber-600 hover:underline no-underline">Home</Link>
        <span>/</span>
        <Link to="/books" className="text-amber-600 hover:underline no-underline">Books</Link>
        <span>/</span>
        <span className="text-stone-800 font-medium truncate max-w-[200px]">{book.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Image */}
        <div className="sticky top-20">
          <div className="bg-amber-50 rounded-2xl p-8 flex items-center justify-center border border-amber-100 min-h-[400px]">
            <img src={book.image || 'https://via.placeholder.com/400x560?text=Book'} alt={book.title}
              className="max-h-[420px] w-full object-contain rounded-lg" />
          </div>

          {/* Stock indicator */}
          <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold border
            ${outOfStock ? 'bg-red-50 border-red-200 text-red-700'
            : lowStock ? 'bg-orange-50 border-orange-200 text-orange-700'
            : 'bg-green-50 border-green-200 text-green-700'}`}>
            {outOfStock ? '❌ Out of stock'
              : lowStock ? `⚡ Only ${book.stock} copies left — order soon!`
              : `✓ In stock — ${book.stock} copies available`}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold tracking-widest uppercase mb-3">
            <div className="w-5 h-px bg-amber-600" /> {book.category}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-3">
            {book.title}
          </h1>

          <p className="text-stone-400 text-base mb-6">
            by <span className="font-semibold text-stone-700">{book.author}</span>
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3 pb-6 mb-6 border-b border-amber-100">
            <span className="text-5xl font-bold text-stone-900">${book.price}</span>
            <span className="text-sm text-stone-400 font-light">Cash on delivery</span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">About this book</h3>
            <p className="text-stone-600 leading-relaxed font-light">
              {book.description || 'No description available for this title.'}
            </p>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[['📚', 'Category', book.category], ['✍️', 'Author', book.author], ['💵', 'Payment', 'Cash on Delivery']].map(([icon, label, val]) => (
              <div key={label} className="bg-white border border-amber-100 rounded-xl px-4 py-2 text-sm">
                <span className="mr-1">{icon}</span>
                <span className="text-stone-400">{label}: </span>
                <span className="font-medium text-stone-800">{val}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleAdd} disabled={outOfStock}
              className={`px-8 py-3.5 rounded-full font-medium text-sm transition-colors
                ${outOfStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 text-amber-50 hover:bg-amber-700'}`}>
              {outOfStock ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
            <Link to="/books"
              className="px-6 py-3.5 rounded-full border border-amber-200 text-stone-700 text-sm font-medium hover:bg-amber-50 transition-colors no-underline">
              ← Back to Books
            </Link>
          </div>

          {/* Delivery note */}
          {!outOfStock && (
            <div className="mt-5 bg-amber-50 rounded-xl px-4 py-3 text-xs text-stone-500 flex flex-wrap gap-3">
              <span>📦 Free delivery over $30</span>
              <span>·</span>
              <span>💵 Pay on delivery</span>
              <span>·</span>
              <span>↩️ Easy returns</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}