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
    e.preventDefault(); 
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      toast.success('Welcome back!');
      nav(u.role === 'admin' ? '/admin' : '/books');

    } catch {} 
    finally { 
      setLoading(false); 
    }
  };

  const inputCls = "w-full border border-amber-100 rounded-xl px-4 py-3 text-sm bg-amber-50/40 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all";
  const labelCls = "text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5 block";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-amber-50/40">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-amber-100 p-8 shadow-sm">

        <div className="font-serif text-amber-600 font-bold mb-6 text-sm tracking-wide">
          BookHaven
        </div>

        <h1 className="font-serif text-2xl font-black text-stone-900 mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-stone-400 mb-6">Sign in to your account to continue</p>

        <form onSubmit={submit} className="space-y-4">

          <div>
            <label className={labelCls}>Email address</label>
            <input type="email" 
            required 
            placeholder="you@example.com"
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })}
            className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Password</label>
            <input type="password" 
            required 
            placeholder="••••••••"
            value={form.password} 
            onChange={e => setForm({ ...form, password: e.target.value })}
            className={inputCls} />
          </div>

          <button disabled={loading}
            className="w-full bg-stone-900 text-amber-50 py-3 rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-60 mt-1">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          
        </form>

        <p className="text-xs text-stone-400 mt-5">
          No account?{' '}
          <Link to="/signup" className="text-amber-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}