import { Check } from 'lucide-react';

const STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderStatusTimeline({ status }) {
  if (status === 'cancelled') return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
        <span className="text-red-600 text-xs font-bold">✕</span>
      </div>
      <div>
        <p className="text-red-700 font-semibold text-sm">Order Cancelled</p>
        <p className="text-red-400 text-xs">This order has been cancelled</p>
      </div>
    </div>
  );

  const idx = STEPS.indexOf(status);

  return (
    <div className="flex items-center w-full overflow-x-auto pb-1">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none min-w-0">

          <div className="flex flex-col items-center gap-1.5 shrink-0">

            {/* Circle */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${i < idx  ? 'bg-amber-500 text-white'           // completed
              : i === idx ? 'bg-stone-900 text-amber-50' // current
              :             'bg-stone-100 text-stone-400'}`}>   {/* upcoming */}
              {i < idx
                ? <Check size={14} strokeWidth={3} />
                : <span>{i + 1}</span>
              }
            </div>

            {/* Label */}
            <span className={`text-xs font-medium capitalize text-center leading-tight
              ${i < idx  ? 'text-amber-600'
              : i === idx ? 'text-stone-900 font-semibold'
              :             'text-stone-300'}`}>
              {s}
            </span>
          </div>

          {/* Connector line */}
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-5 transition-all
              ${i < idx ? '' : 'bg-stone-200'}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}