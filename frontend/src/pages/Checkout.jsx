import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { total, refresh } = useCart();
  const nav = useNavigate();
  const [addr, setAddr] = useState({ street: '', city: '', country: '' });
  const [loading, setLoading] = useState(false);


  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/orders', { shippingAddress: addr });
      await refresh();
      toast.success('Order placed!');
      nav(`/my-orders/${data.order._id}`);

    } catch { }
    finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p className="mb-3">Total: <span className="font-bold">${total.toFixed(2)}</span></p>

      {/* checkout form  */}
      <form onSubmit={submit} className="space-y-3">

        {/* street address  */}
        <input required
          placeholder="Street address"
          value={addr.street}
          onChange={e => setAddr({ ...addr, street: e.target.value })}
          className="w-full border rounded px-3 py-2" />

        {/* city  */}
        <input required
          placeholder="City"
          value={addr.city}
          onChange={e => setAddr({ ...addr, city: e.target.value })}
          className="w-full border rounded px-3 py-2" />

        {/* country  */}
        <input required
          placeholder="Country"
          value={addr.country}
          onChange={e => setAddr({ ...addr, country: e.target.value })}
          className="w-full border rounded px-3 py-2" />

        <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">
          {loading ? 'Placing...' : 'Place order'}</button>
      </form>
    </div>
  );
}
