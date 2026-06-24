import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';

export default function Dashboard() {
  const { data: books } = useQuery({ queryKey: ['a-books'], queryFn: () => api.get('/books?limit=1000').then(r=>r.data) });
  const { data: orders } = useQuery({ queryKey: ['a-orders'], queryFn: () => api.get('/orders?limit=1000').then(r=>r.data) });
  const { data: users } = useQuery({ queryKey: ['a-users'], queryFn: () => api.get('/users').then(r=>r.data) });
  const revenue = orders?.orders?.reduce((s,o)=>s+o.totalAmount,0) || 0;
  const cards = [
    { label: 'Users', value: users?.users?.length || 0 },
    { label: 'Books', value: books?.total || 0 },
    { label: 'Orders', value: orders?.total || 0 },
    { label: 'Revenue', value: `Rs.${revenue.toFixed(2)}` },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c=>(
          <div key={c.label} className="bg-white rounded shadow p-4">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <a href="/admin/books" className="bg-black text-white text-center py-3 rounded">Manage Books</a>
        <a href="/admin/orders" className="bg-black text-white text-center py-3 rounded">Manage Orders</a>
        <a href="/admin/users" className="bg-black text-white text-center py-3 rounded">Manage Users</a>
        <a href="/admin/books/add" className="bg-emerald-600 text-white text-center py-3 rounded">Add Book</a>
      </div>
    </div>
  );
}
