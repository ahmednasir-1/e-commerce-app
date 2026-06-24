import { Check, X } from 'lucide-react';

const STEPS = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];

export default function OrderStatusTimeline({ status }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <X size={16} className="text-red-600" />
        </div>

        <div>
          <p className="text-red-700 font-semibold text-sm">
            Order Cancelled
          </p>

          <p className="text-red-400 text-xs">
            This order has been cancelled
          </p>
        </div>
      </div>
    );
  }

  const idx = STEPS.indexOf(status);

  return (
    <>
      {/* MOBILE */}
      <div className="md:hidden">
        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <div key={step} className="flex gap-3">

              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${
                      i < idx
                        ? 'bg-amber-500 text-white'
                        : i === idx
                        ? 'bg-stone-900 text-amber-50'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                >
                  {i < idx ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    i + 1
                  )}
                </div>

                {i !== STEPS.length - 1 && (
                  <div
                    className={`w-0.5 h-8 mt-1
                      ${
                        i < idx
                          ? 'bg-amber-500'
                          : 'bg-stone-200'
                      }`}
                  />
                )}
              </div>

              {/* Text */}
              <div className="pt-1">
                <p
                  className={`capitalize text-sm font-medium
                    ${
                      i < idx
                        ? 'text-amber-600'
                        : i === idx
                        ? 'text-stone-900 font-semibold'
                        : 'text-stone-400'
                    }`}
                >
                  {step}
                </p>

                {i === idx && (
                  <p className="text-xs text-stone-400">
                    Current Status
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex items-center w-full">
        {STEPS.map((step, i) => (
          <div
            key={step}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center gap-2 shrink-0">

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${
                    i < idx
                      ? 'bg-amber-500 text-white'
                      : i === idx
                      ? 'bg-stone-900 text-amber-50'
                      : 'bg-stone-100 text-stone-400'
                  }`}
              >
                {i < idx ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  i + 1
                )}
              </div>

              <span
                className={`text-xs font-medium capitalize text-center
                  ${
                    i < idx
                      ? 'text-amber-600'
                      : i === idx
                      ? 'text-stone-900 font-semibold'
                      : 'text-stone-300'
                  }`}
              >
                {step}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-6
                  ${
                    i < idx
                      ? 'bg-amber-500'
                      : 'bg-stone-200'
                  }`}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}