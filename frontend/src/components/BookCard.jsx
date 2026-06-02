import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function BookCard({ book }) {

  const { addToCart } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();


  const handleAdd = async () => {

    // if user not login then first goto login page
    if (!user)
      return nav('/login');

    await addToCart(book._id, 1);
    toast.success('Added to cart');
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex flex-col">

      <Link to={`/books/${book._id}`}>
        <img src={book.image || 'https://via.placeholder.com/300x400?text=Book'} alt={book.title} className="w-full h-56 object-cover" />
      </Link>

      <div className="p-3 flex flex-col flex-1">

        <span className="text-xs text-indigo-600 font-semibold">
          {book.category}
        </span>

        <Link to={`/books/${book._id}`}
          className="font-semibold mt-1 line-clamp-1 hover:underline">{book.title}
        </Link>

        <p className="text-sm text-slate-500">{book.author}</p>

        <div className="mt-auto flex justify-between items-center pt-3">
          <span className="font-bold text-lg">${book.price}</span>

          <button onClick={handleAdd}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700">
            Add
          </button>

        </div>
      </div>
    </div>
  );
}
