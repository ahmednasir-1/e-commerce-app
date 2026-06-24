import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CATS = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Biography', 'Children', 'Other'];

export default function BookForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: '', author: '', description: '',
    price: '', category: 'Fiction', stock: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) api.get(`/books/${id}`).then(r => {
      const b = r.data.book;
      setForm({ title: b.title, author: b.author, description: b.description || '', price: b.price, category: b.category, stock: b.stock });
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);
      if (id) await api.put(`/books/${id}`, fd);
      else await api.post('/books', fd);
      toast.success('Saved');
      nav('/admin/books');
    } catch {} finally { setLoading(false); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputCls = "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all";
  const labelCls = "block text-sm font-medium text-stone-600 mb-1";

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto bg-white shadow rounded-lg p-6 space-y-4">

      <h1 className="text-2xl font-bold text-stone-900">{id ? 'Edit' : 'Add'} Book</h1>

      {/* Title */}
      <div>
        <label className={labelCls}>Title</label>
        <input
          required
          placeholder="e.g. The Alchemist"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Author */}
      <div>
        <label className={labelCls}>Author</label>
        <input
          required
          placeholder="e.g. Paulo Coelho"
          value={form.author}
          onChange={e => set('author', e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          placeholder="Brief description of the book…"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={4}
          className={inputCls}
        />
      </div>

      {/* Price · Stock · Category */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Price</label>
          <input
            type="number"
            required
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.price}
            onChange={e => set('price', e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Stock</label>
          <input
            type="number"
            required
            min="0"
            placeholder="0"
            value={form.stock}
            onChange={e => set('stock', e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className={inputCls}>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Image */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])}
          className="w-full text-sm text-stone-500 file:mr-3 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium  file:transition-colors cursor-pointer"
        />
      </div>

      <button
        disabled={loading}
        className="w-full bg-black text-white py-2.5 rounded text-sm font-medium transition-colors disabled:opacity-60">
        {loading ? 'Saving…' : id ? 'Update Book' : 'Add Book'}
      </button>

    </form>
  );
}