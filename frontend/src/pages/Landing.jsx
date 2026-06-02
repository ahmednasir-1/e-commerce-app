import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import BookCard from '../components/BookCard.jsx';
import { Link } from 'react-router-dom';

export default function Landing() {
  const { data } = useQuery({
    queryKey: ['featured'],
    queryFn: () => api.get('/books?limit=8').then(r => r.data),
  });
  
  return (
    <div className="space-y-10">
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl p-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Discover your next great read</h1>
        <p className="mt-3 opacity-90">Thousands of titles across every genre.</p>
        <Link to="/books" className="inline-block mt-6 bg-white text-indigo-700 font-semibold px-6 py-2.5 rounded-lg">Browse books</Link>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data?.books?.map(b => <BookCard key={b._id} book={b} />)}
        </div>
      </section>
    </div>
  );
}
