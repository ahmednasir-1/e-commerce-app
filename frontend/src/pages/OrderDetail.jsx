import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import OrderStatusBadge from '../components/OrderStatusBadge.jsx';
import OrderStatusTimeline from '../components/OrderStatusTimeline.jsx';

export default function OrderDetail() {

  const { id } = useParams();

  const { data, isLoading } = useQuery({ queryKey: ['order', id], queryFn: () => api.get(`/orders/${id}`).then(r => r.data) });

  if (isLoading) 
    return <div>Loading…</div>;

  const o = data?.order;
  if (!o) 
    return <div>Not found</div>;

  return (

    <div className="space-y-6">
      <div className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">Order #{o._id.slice(-6)}</h1>
            <p className="text-sm text-slate-500">{new Date(o.createdAt).toLocaleString()}</p>
          </div>
          <OrderStatusBadge status={o.status} />
        </div>
        <OrderStatusTimeline status={o.status} />
      </div>


      {/* items detail  */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="font-bold mb-3">Items</h2>
        {o.items.map((i,idx)=>(

          <div key={idx} className="flex justify-between border-b py-2 last:border-0">
            <span>{i.bookId?.title} x {i.quantity}</span>
            <span>${(i.price * i.quantity).toFixed(2)}</span>
          </div>

        ))}
        <div className="flex justify-between pt-3 font-bold"><span>Total</span><span>${o.totalAmount.toFixed(2)}</span></div>
      </div>

      {/* shipping address detail  */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="font-bold mb-2">Shipping</h2>
        <p>{o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.country}</p>
      </div>
      
    </div>
  );
}
