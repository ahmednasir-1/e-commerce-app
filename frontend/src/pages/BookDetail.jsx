import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function BookDetail() {

  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ['book', id], queryFn: () => api.get(`/books/${id}`).then(r => r.data) });

  if (isLoading) 
    return <div>Loading…</div>;

  const book = data?.book;
  if (!book) 
    return <div>Not found</div>;

  const handleAdd = async () => {
    if (!user) 
      return nav('/login');

    await addToCart(book._id, 1);
    toast.success('Added to cart');
  };

  
  return (
    <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg shadow p-6">
      <img src={book.image} alt={book.title} className="w-full max-h-[500px] object-contain rounded" />
      <div>
        <span className="text-sm text-indigo-600 font-semibold">{book.category}</span>
        <h1 className="text-3xl font-bold mt-1">{book.title}</h1>
        <p className="text-slate-600 mt-1">by {book.author}</p>
        <p className="text-3xl font-bold mt-4">${book.price}</p>
        <p className="text-sm text-slate-500 mt-1">Stock: {book.stock}</p>
        <p className="mt-4 text-slate-700">{book.description}</p>
        <button onClick={handleAdd} disabled={book.stock<1} className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded hover:bg-indigo-700 disabled:opacity-50">Add to cart</button>
      </div>
    </div>
  );
}
