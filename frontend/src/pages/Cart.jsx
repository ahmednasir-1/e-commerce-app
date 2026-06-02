import { useCart } from '../context/CartContext.jsx';
import { Link } from 'react-router-dom';

export default function Cart() {

  const { cart, update, remove, total } = useCart();

  if (!cart.length)
    return (
      <div className="text-center py-12">Cart is empty.
        <Link to="/books" className="text-indigo-600">Browse books</Link>
      </div>
    )

  return (
    <div className="grid md:grid-cols-[1fr_300px] gap-6">
      <div className="space-y-3">

        {/* cart details  */}
        {cart.map(i => (
          <div key={i.bookId._id} className="bg-white p-4 rounded shadow flex gap-4">
            <img src={i.bookId.image} alt="" className="w-20 h-28 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{i.bookId.title}</h3>
              <p className="text-sm text-slate-500">{i.bookId.author}</p>
              <p className="font-bold mt-1">${i.bookId.price}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <input type="number" min="1" value={i.quantity} onChange={e => update(i.bookId._id, Number(e.target.value))} className="w-16 border rounded px-2 py-1" />
              <button onClick={() => remove(i.bookId._id)} className="text-red-600 text-sm">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* summary  */}
      <div className="bg-white p-4 rounded shadow h-fit">
        <h3 className="font-bold mb-3">Summary</h3>
        <div className="flex justify-between mb-3"><span>Total</span><span className="font-bold">${total.toFixed(2)}</span></div>
        <Link to="/checkout" className="block bg-indigo-600 text-white text-center py-2 rounded">Checkout</Link>
      </div>
    </div>
  );
}
