import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminBooks() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-books'], queryFn: () => api.get('/books?limit=1000').then(r=>r.data) });
  const del = async (id) => {
    if (!confirm('Delete this book?')) return;
    await api.delete(`/books/${id}`);
    toast.success('Deleted');
    qc.invalidateQueries({ queryKey: ['admin-books'] });
  };
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Books</h1>
        <Link to="/admin/books/add" className="bg-indigo-600 text-white px-4 py-2 rounded">+ Add</Link>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr>
            <th className="p-3 text-left">Title</th><th className="p-3 text-left">Author</th><th>Cat</th><th>Price</th><th>Stock</th><th></th>
          </tr></thead>
          <tbody>
            {data?.books?.map(b=>(
              <tr key={b._id} className="border-t">
                <td className="p-3">{b.title}</td>
                <td className="p-3">{b.author}</td>
                <td className="text-center">{b.category}</td>
                <td className="text-center">${b.price}</td>
                <td className="text-center">{b.stock}</td>
                <td className="p-3 text-right space-x-2">
                  <Link to={`/admin/books/edit/${b._id}`} className="text-indigo-600">Edit</Link>
                  <button onClick={()=>del(b._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
