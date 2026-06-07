import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const STEPS = ['Details', 'Email OTP', 'Phone OTP'];

const COUNTRY_CODES = [
  { code: '+92',  flag: '🇵🇰', name: 'PK' },
  { code: '+1',   flag: '🇺🇸', name: 'US' },
  { code: '+44',  flag: '🇬🇧', name: 'UK' },
  { code: '+91',  flag: '🇮🇳', name: 'IN' },
  { code: '+971', flag: '🇦🇪', name: 'AE' },
  { code: '+966', flag: '🇸🇦', name: 'SA' },
  { code: '+974', flag: '🇶🇦', name: 'QA' },
  { code: '+965', flag: '🇰🇼', name: 'KW' },
  { code: '+973', flag: '🇧🇭', name: 'BH' },
  { code: '+968', flag: '🇴🇲', name: 'OM' },
  { code: '+49',  flag: '🇩🇪', name: 'DE' },
  { code: '+33',  flag: '🇫🇷', name: 'FR' },
  { code: '+61',  flag: '🇦🇺', name: 'AU' },
  { code: '+81',  flag: '🇯🇵', name: 'JP' },
  { code: '+86',  flag: '🇨🇳', name: 'CN' },
];

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Full E.164 phone: +92 + 3001234567 = +923001234567
  const fullPhone = `${countryCode}${phoneNumber}`;

  // Only allow digits, max 10
  const handlePhoneInput = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(digits);
  };

  const sendOtps = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }
    setLoading(true);
    try {
      await Promise.all([
        api.post('/auth/send-email-otp', { email: form.email, name: form.name }),
        api.post('/auth/send-otp', { phone: fullPhone }),
      ]);
      toast.success('Verification codes sent!');
      setStep(2);
    } catch {} finally { setLoading(false); }
  };

  const verifyEmail = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post('/auth/verify-email-otp', { email: form.email, otp: emailOtp });
      toast.success('Email verified!');
      setStep(3);
    } catch {} finally { setLoading(false); }
  };

  const verifyPhoneAndCreate = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post('/auth/verify-otp', { phone: fullPhone, otp: phoneOtp });
      toast.success('Phone verified!');
      await signup({ ...form, phone: fullPhone });
      toast.success('Account created! Welcome 🎉');
      nav('/books');
    } catch {} finally { setLoading(false); }
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
          Create account
        </h1>
        <p className="text-sm text-stone-400 mb-5">Step {step} of 3 — {STEPS[step - 1]}</p>

        {/* Progress */}
        <div className="flex items-center gap-1.5 mb-6">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-1.5 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                ${step > i + 1 ? 'bg-green-100 text-green-700'
                  : step === i + 1 ? 'bg-stone-900 text-amber-50'
                  : 'bg-stone-100 text-stone-400'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${step === i + 1 ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
                {label}
              </span>
              {i < 2 && (
                <div className={`flex-1 h-px ${step > i + 1 ? 'bg-green-300' : 'bg-stone-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <form onSubmit={sendOtps} className="space-y-4">

            {/* Name */}
            <div>
              <label className={labelCls}>Full Name</label>
              <input type="text" required placeholder="Ahmed Ali"
                value={form.name} onChange={e => set('name', e.target.value)}
                className={inputCls} />
            </div>

            {/* Email */}
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" required placeholder="you@example.com"
                value={form.email} onChange={e => set('email', e.target.value)}
                className={inputCls} />
            </div>

            {/* Password */}
            <div>
              <label className={labelCls}>Password</label>
              <input type="password" required placeholder="Min 6 characters"
                value={form.password} onChange={e => set('password', e.target.value)}
                minLength={6} className={inputCls} />
            </div>

            {/* Phone — country code dropdown + 10-digit input */}
            <div>
              <label className={labelCls}>Phone Number</label>
              <div className="flex gap-2">

                {/* Country code dropdown */}
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  className="border border-amber-100 rounded-xl px-3 py-3 text-sm bg-amber-50/40
                    focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100
                    transition-all shrink-0 cursor-pointer">
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>

                {/* 10-digit number input */}
                <div className="relative flex-1">
                  <input
                    type="tel"
                    required
                    placeholder="3001234567"
                    value={phoneNumber}
                    onChange={handlePhoneInput}
                    maxLength={10}
                    className={`${inputCls} pr-16`}
                  />
                  {/* digit counter */}
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold
                    ${phoneNumber.length === 10 ? 'text-green-500' : 'text-stone-300'}`}>
                    {phoneNumber.length}/10
                  </span>
                </div>
              </div>

              {/* Preview full number */}
              {phoneNumber.length > 0 && (
                <p className="text-xs text-stone-400 mt-1.5 ml-1">
                  Full number: <span className="text-amber-600 font-medium">{fullPhone}</span>
                </p>
              )}

              {/* Warning if incomplete */}
              {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                <p className="text-xs text-red-400 mt-1 ml-1">
                  {10 - phoneNumber.length} more digit{10 - phoneNumber.length !== 1 ? 's' : ''} needed
                </p>
              )}

              {/* Green tick when complete */}
              {phoneNumber.length === 10 && (
                <p className="text-xs text-green-500 font-medium mt-1 ml-1">
                  ✓ Phone number complete
                </p>
              )}
            </div>

            <button disabled={loading}
              className="w-full bg-stone-900 text-amber-50 py-3 rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-60">
              {loading ? 'Sending codes…' : 'Send Verification Codes'}
            </button>
          </form>
        )}

        {/* ── Step 2 — Email OTP ── */}
        {step === 2 && (
          <form onSubmit={verifyEmail} className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-stone-500">
              Code sent to <span className="text-amber-600 font-semibold">{form.email}</span>. Check your inbox.
            </div>
            <div>
              <label className={labelCls}>Email OTP</label>
              <input required maxLength={6} placeholder="· · · · · ·"
                value={emailOtp} onChange={e => setEmailOtp(e.target.value)}
                className={`${inputCls} text-center text-2xl tracking-[.5rem] font-bold`} />
            </div>
            <button disabled={loading}
              className="w-full bg-stone-900 text-amber-50 py-3 rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-60">
              {loading ? 'Verifying…' : 'Verify Email'}
            </button>
            <button type="button" onClick={() => setStep(1)}
              className="w-full text-xs text-amber-600 font-medium hover:underline bg-transparent border-none cursor-pointer">
              ← Go back
            </button>
          </form>
        )}

        {/* ── Step 3 — Phone OTP ── */}
        {step === 3 && (
          <form onSubmit={verifyPhoneAndCreate} className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-stone-500">
              Code sent to <span className="text-amber-600 font-semibold">{fullPhone}</span> via SMS.
            </div>
            <div>
              <label className={labelCls}>Phone OTP</label>
              <input required maxLength={6} placeholder="· · · · · ·"
                value={phoneOtp} onChange={e => setPhoneOtp(e.target.value)}
                className={`${inputCls} text-center text-2xl tracking-[.5rem] font-bold`} />
            </div>
            <button disabled={loading}
              className="w-full bg-stone-900 text-amber-50 py-3 rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-60">
              {loading ? 'Creating account…' : 'Verify & Create Account'}
            </button>
            <button type="button" onClick={() => setStep(2)}
              className="w-full text-xs text-amber-600 font-medium hover:underline bg-transparent border-none cursor-pointer">
              ← Go back
            </button>
          </form>
        )}

        <p className="text-xs text-stone-400 mt-5">
          Have an account?{' '}
          <Link to="/login" className="text-amber-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}