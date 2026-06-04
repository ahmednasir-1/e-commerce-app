import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import OrderStatusBadge from '../components/OrderStatusBadge.jsx';
import OrderStatusTimeline from '../components/OrderStatusTimeline.jsx';

export default function OrderDetail() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then(r => r.data),
  });

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center text-amber-700">
      Loading order…
    </div>
  );

  const o = data?.order;
  if (!o) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="text-5xl">🔍</div>
      <h2 className="text-3xl font-bold text-stone-900">Order not found</h2>
      <Link to="/my-orders" className="text-amber-600 hover:underline">← Back to orders</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50/40 px-6 md:px-[6vw] py-12">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-400 mb-8">
        <Link to="/my-orders" className="text-amber-600 hover:underline no-underline">My Orders</Link>
        <span>/</span>
        <span className="text-stone-800 font-medium">#{o._id.slice(-6).toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── LEFT (2 cols) ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Order header */}
          <div className="bg-white rounded-2xl p-6 border border-amber-100">
            <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold tracking-widest uppercase mb-1">
                  <div className="w-5 h-px bg-amber-600" /> Order details
                </div>
                <h1 className="text-3xl font-bold text-stone-900">
                  #{o._id.slice(-6).toUpperCase()}
                </h1>
                <p className="text-xs text-stone-400 mt-1">
                  Placed on {new Date(o.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <OrderStatusBadge status={o.status} />
            </div>

            {/* Timeline */}
            <OrderStatusTimeline status={o.status} />
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl p-6 border border-amber-100">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold tracking-widest uppercase mb-4">
              <div className="w-5 h-px bg-amber-600" /> Items ordered
            </div>

            <div className="flex flex-col divide-y divide-amber-50">
              {o.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-lg shrink-0">
                    📖
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 truncate text-sm">
                      {item.bookId?.title || 'Unknown Book'}
                    </p>
                    <p className="text-xs text-stone-400">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-stone-900 text-sm shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 mt-2 border-t border-amber-100">
              <span className="font-semibold text-stone-600 text-sm">Total</span>
              <span className="text-2xl font-bold text-stone-900">
                ${o.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl p-6 border border-amber-100">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold tracking-widest uppercase mb-4">
              <div className="w-5 h-px bg-amber-600" /> Payment
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-lg">💵</div>
              <div>
                <p className="font-semibold text-stone-800 text-sm">Cash on Delivery</p>
                <p className="text-xs text-stone-400">Pay when your order arrives</p>
              </div>
              <span className="ml-auto text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                {o.paymentStatus || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT (1 col) ── */}
        <div className="flex flex-col gap-5">

          {/* Shipping address */}
          <div className="bg-white rounded-2xl p-6 border border-amber-100">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold tracking-widest uppercase mb-4">
              <div className="w-5 h-px bg-amber-600" /> Shipping address
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-lg shrink-0">📍</div>
              <div className="text-sm text-stone-600 leading-relaxed">
                <p className="font-semibold text-stone-800">{o.shippingAddress.street}</p>
                <p>{o.shippingAddress.city}{o.shippingAddress.state ? `, ${o.shippingAddress.state}` : ''}</p>
                {o.shippingAddress.zipCode && <p>{o.shippingAddress.zipCode}</p>}
                <p>{o.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order summary card */}
          <div className="bg-stone-900 rounded-2xl p-6 text-amber-50">
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">Summary</p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-200/60">Items</span>
                <span>{o.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200/60">Payment</span>
                <span>Cash on Delivery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200/60">Status</span>
                <span className="capitalize">{o.status}</span>
              </div>
              <div className="flex justify-between pt-3 mt-1 border-t border-amber-50/10 font-bold text-base">
                <span>Total</span>
                <span>${o.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Back link */}
          <Link to="/my-orders"
            className="block text-center bg-white border border-amber-100 text-stone-700 rounded-full py-3 text-sm font-medium hover:bg-amber-50 transition-colors no-underline">
            ← Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}