import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CATS = ['Fiction','Non-Fiction','Science','History','Technology','Biography','Children','Other'];

export default function BookForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ title:'', author:'', description:'', price:0, category:'Fiction', stock:0 });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) api.get(`/books/${id}`).then(r=>{
      const b = r.data.book; setForm({title:b.title,author:b.author,description:b.description||'',price:b.price,category:b.category,stock:b.stock});
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v])=>fd.append(k,v));
      if (file) fd.append('image', file);
      if (id) await api.put(`/books/${id}`, fd);
      else await api.post('/books', fd);
      toast.success('Saved'); nav('/admin/books');
    } catch {} finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto bg-white shadow rounded-lg p-6 space-y-3">
      <h1 className="text-2xl font-bold">{id?'Edit':'Add'} Book</h1>
      <input required placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full border rounded px-3 py-2" />
      <input required placeholder="Author" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} className="w-full border rounded px-3 py-2" />
      <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full border rounded px-3 py-2" rows={4} />
      <div className="grid grid-cols-3 gap-3">
        <input type="number" required step="0.01" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="border rounded px-3 py-2" />
        <input type="number" required placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="border rounded px-3 py-2" />
        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="border rounded px-3 py-2">
          {CATS.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} className="w-full" />
      <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading?'…':'Save'}</button>
    </form>
  );
}
