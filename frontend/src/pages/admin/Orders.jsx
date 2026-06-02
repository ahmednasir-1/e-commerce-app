import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../utils/api';
import OrderStatusBadge from '../../components/OrderStatusBadge.jsx';
import toast from 'react-hot-toast';

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled'];

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-orders', page], queryFn: () => api.get(`/orders?page=${page}&limit=20`).then(r=>r.data) });
  const update = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    toast.success('Status updated');
    qc.invalidateQueries({ queryKey: ['admin-orders'] });
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr>
            <th className="p-3 text-left">Order</th><th className="text-left">User</th><th>Total</th><th>Date</th><th>Status</th><th>Change</th>
          </tr></thead>
          <tbody>
            {data?.orders?.map(o=>(
              <tr key={o._id} className="border-t">
                <td className="p-3">#{o._id.slice(-6)}</td>
                <td>{o.userId?.name} <span className="text-slate-500 text-xs">({o.userId?.email})</span></td>
                <td className="text-center">${o.totalAmount.toFixed(2)}</td>
                <td className="text-center">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="text-center"><OrderStatusBadge status={o.status}/></td>
                <td className="text-center">
                  <select value={o.status} onChange={e=>update(o._id, e.target.value)} className="border rounded px-2 py-1">
                    {STATUSES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data && data.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({length:data.pages}).map((_,i)=>(
            <button key={i} onClick={()=>setPage(i+1)} className={`px-3 py-1 rounded border ${page===i+1?'bg-indigo-600 text-white':'bg-white'}`}>{i+1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
