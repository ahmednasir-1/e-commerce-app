import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import OrderStatusBadge from '../components/OrderStatusBadge.jsx';

export default function MyOrders() {

  const { data, isLoading } = useQuery({ queryKey: ['my-orders'], queryFn: () => api.get('/orders/my-orders').then(r => r.data) });

  // loading screen
  if (isLoading) 
    return <div>Loading…</div>;

  // if user has no orders
  if (!data?.orders?.length) 
    return <div className="text-center py-12">No orders yet.</div>;

  return (
    <div className="space-y-3">

      <h1 className="text-2xl font-bold">My Orders</h1>

      {data.orders.map(o => (
        <Link to={`/my-orders/${o._id}`} key={o._id} className="block bg-white rounded shadow p-4 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Order #{o._id.slice(-6)}</p>
              <p className="text-sm text-slate-500">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} items · ${o.totalAmount.toFixed(2)}</p>
            </div>
            <OrderStatusBadge status={o.status} />
          </div>
        </Link>
      ))}
      
    </div>
  );
}
