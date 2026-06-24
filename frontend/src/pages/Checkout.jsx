import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: form,
        paymentMethod: 'cod',
      });
      toast.success('Order placed successfully!');
      nav(`/my-orders/${data.order._id}`); // go to order detail
    } catch {
      // error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Shipping Address ── */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Street Address</label>
              <input
                name="street"
                required
                placeholder="House #, Street, Area"
                value={form.street}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">City</label>
                <input
                  name="city"
                  required
                  placeholder="Islamabad"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">State / Province</label>
                <input
                  name="state"
                  required
                  placeholder="Punjab"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">ZIP / Postal Code</label>
                <input
                  name="zipCode"
                  placeholder="75500"
                  value={form.zipCode}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Country</label>
                <input
                  name="country"
                  required
                  value={form.country}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Payment Method ── */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

          {/* COD option — selected by default, only option */}
          <div className="flex items-center gap-3 border-2 border-black rounded-lg p-4 bg-indigo-50">
            <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-black" />
            </div>
            <div>
              <p className="font-semibold text-black">Cash on Delivery</p>
              <p className="text-sm text-gray-500">Pay when your order arrives at your door</p>
            </div>
            <span className="ml-auto text-2xl"></span>
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3">🧾 Order Note</h2>
          <p className="text-sm text-gray-600">
            Your order will be confirmed immediately. Our team will contact you before delivery.
            Payment is collected at the time of delivery.
          </p>
        </div>

        {/* ── Place Order Button ── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-amber-600 disabled:opacity-60 transition"
        >
          {loading ? 'Placing Order…' : 'Place Order (Cash on Delivery)'}
        </button>

      </form>
    </div>
  );
}