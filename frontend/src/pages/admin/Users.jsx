import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-users'], queryFn: () => api.get('/users').then(r=>r.data) });
  const del = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    toast.success('Deleted');
    qc.invalidateQueries({ queryKey: ['admin-users'] });
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr>
            <th className="p-3 text-left">Name</th><th className="text-left">Email</th><th>Phone</th><th>Role</th><th>Orders</th><th></th>
          </tr></thead>
          <tbody>
            {data?.users?.map(u=>(
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td>{u.email}</td>
                <td className="text-center">{u.phone}</td>
                <td className="text-center">{u.role}</td>
                <td className="text-center">{u.orderCount}</td>
                <td className="text-right p-3">{u.role!=='admin' && <button onClick={()=>del(u._id)} className="text-red-600">Delete</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
