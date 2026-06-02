import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  // Step 1 → Send both OTPs at once
  const sendOtps = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send email OTP and phone OTP simultaneously
      await Promise.all([
        api.post('/auth/send-email-otp', { email: form.email, name: form.name }),
        api.post('/auth/send-otp', { phone: form.phone }),
      ]);
      toast.success('OTP sent to your email and phone');
      setStep(2);
    } catch {
      // error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → Verify Email OTP
  const verifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-email-otp', { email: form.email, otp: emailOtp });
      toast.success('Email verified!');
      setStep(3);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  // Step 3 → Verify Phone OTP then create account
  const verifyPhoneAndCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { phone: form.phone, otp: phoneOtp });
      toast.success('Phone verified!');

      // Both verified — create account
      await signup({ ...form });
      toast.success('Account created! Welcome 🎉');
      nav('/books');
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6 mt-6">
      <h1 className="text-2xl font-bold mb-1">Sign up</h1>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-6">
        {['Details', 'Email OTP', 'Phone OTP'].map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${step > i + 1 ? 'bg-green-500 text-white'
              : step === i + 1 ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-400'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-xs ${step === i + 1 ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < 2 && <div className={`h-0.5 flex-1 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* ── Step 1 — Fill Form ── */}
      {step === 1 && (
        <form onSubmit={sendOtps} className="space-y-3">
          <input
            required
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6)"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <input
            required
            placeholder="Phone (+92xxxxxxxxxx)"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">
            {loading ? 'Sending OTPs…' : 'Send Verification Codes'}
          </button>
        </form>
      )}

      {/* ── Step 2 — Verify Email OTP ── */}
      {step === 2 && (
        <form onSubmit={verifyEmail} className="space-y-3">
          <p className="text-sm text-slate-600">
            Enter the 6-digit code sent to <strong>{form.email}</strong>
          </p>
          <input
            required
            placeholder="Email OTP"
            maxLength={6}
            value={emailOtp}
            onChange={e => setEmailOtp(e.target.value)}
            className="w-full border rounded px-3 py-2 tracking-widest text-center text-lg"
          />
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">
            {loading ? 'Verifying…' : 'Verify Email'}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-sm text-indigo-600 underline"
          >
            ← Go back
          </button>
        </form>
      )}

      {/* ── Step 3 — Verify Phone OTP ── */}
      {step === 3 && (
        <form onSubmit={verifyPhoneAndCreate} className="space-y-3">
          <p className="text-sm text-slate-600">
            Enter the 6-digit code sent to <strong>{form.phone}</strong>
          </p>
          <input
            required
            placeholder="Phone OTP"
            maxLength={6}
            value={phoneOtp}
            onChange={e => setPhoneOtp(e.target.value)}
            className="w-full border rounded px-3 py-2 tracking-widest text-center text-lg"
          />
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">
            {loading ? 'Creating account…' : 'Verify Phone & Create Account'}
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full text-sm text-indigo-600 underline"
          >
            ← Go back
          </button>
        </form>
      )}

      <p className="mt-3 text-sm">
        Have an account? <Link to="/login" className="text-indigo-600">Login</Link>
      </p>
    </div>
  );
}