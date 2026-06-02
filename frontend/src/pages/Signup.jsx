import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // send otp function
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { 
      await api.post('/auth/send-otp', { phone }); toast.success('OTP sent'); setStep(2); 
    }
    catch {} 
    finally { 
      setLoading(false); 
    }
  };

  // verify otp
  const verify = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try { 
      await api.post('/auth/verify-otp', { phone, otp }); toast.success('Phone verified'); setStep(3); 
    }
    catch {} 
    finally { 
      setLoading(false); 
    }
  };


  // account created
  const finalize = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      await signup({ ...form, phone });
      toast.success('Account created');
      nav('/books');
      
    } catch {} finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6 mt-6">
      <h1 className="text-2xl font-bold mb-1">Sign up</h1>
      <p className="text-sm text-slate-500 mb-4">Step {step} of 3</p>
      {step === 1 && (
        <form onSubmit={sendOtp} className="space-y-3">
          <input required placeholder="Phone (+1234567890)" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading?'…':'Send OTP'}</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={verify} className="space-y-3">
          <input required placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} className="w-full border rounded px-3 py-2" />
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading?'…':'Verify'}</button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={finalize} className="space-y-3">
          <input required placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded px-3 py-2" />
          <input type="email" required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full border rounded px-3 py-2" />
          <input type="password" required minLength={6} placeholder="Password (min 6)" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full border rounded px-3 py-2" />
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading?'…':'Create account'}</button>
        </form>
      )}
      <p className="mt-3 text-sm">Have an account? <Link to="/login" className="text-indigo-600">Login</Link></p>
    </div>
  );
}
