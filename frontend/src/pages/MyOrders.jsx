import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import OrderStatusBadge from '../components/OrderStatusBadge.jsx';
import { Package } from 'lucide-react';

export default function MyOrders() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/my-orders').then(r => r.data),
  });

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center text-amber-700">
      Loading orders…
    </div>
  );

  if (!data?.orders?.length) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 ">
      <div className="text-6xl">
        <Package size={19}/>
      </div>
      <h2 className="text-3xl font-bold text-stone-900">No orders yet</h2>
      <p className="text-stone-500 text-sm">You haven't placed any orders yet.</p>
      <Link to="/books" className="bg-stone-900 text-amber-50 px-7 py-3 rounded-full font-medium text-sm hover:bg-amber-700 transition-colors">
        Browse Books 
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50/40 px-6 md:px-[6vw] py-12">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold tracking-widest uppercase mb-2">
          Your history
        </div>
        <h1 className="text-4xl font-bold text-stone-900">My Orders</h1>
        <p className="text-stone-400 text-sm mt-1">
          {data.orders.length} order{data.orders.length !== 1 ? 's' : ''} placed
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {data.orders.map(o => (
          <Link key={o._id} to={`/my-orders/${o._id}`}
            className="block bg-white rounded-2xl p-5 border border-amber-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 no-underline text-inherit">

            <div className="flex justify-between items-start gap-4 flex-wrap">

              {/* Left */}
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">
                  <Package size={18}/>
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-lg">
                    Order #{o._id.slice(-6).toUpperCase()}
                  </p>
                  <div className="flex flex-wrap gap-2 items-center justify-center text-xs text-stone-400 mt-0.5">
                    <span>{new Date(o.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>·</span>
                    <span>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</span>
                    <span>·</span>
                    <span className="font-bold text-stone-800 text-sm">Rs.{o.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={o.status} />
              </div>
            </div>

            {/* Book titles preview */}
            <div className="mt-4 pt-4 border-t border-amber-50 text-xs text-stone-400 truncate">
              {o.items.map(i => i.bookId?.title || 'Unknown').join(' · ')}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}