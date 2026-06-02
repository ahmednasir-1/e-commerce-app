import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {

  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);


  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const u = await login(form.email, form.password);
      toast.success('Welcome back!');
      nav(u.role === 'admin' ? '/admin' : '/books');
    } catch {} finally { setLoading(false); }
  };

  
  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input type="email" required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full border rounded px-3 py-2" />
        <input type="password" required placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full border rounded px-3 py-2" />
        <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading?'…':'Login'}</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link to="/signup" className="text-indigo-600">Sign up</Link></p>
    </div>
  );
}
