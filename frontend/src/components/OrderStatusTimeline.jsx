const STEPS = ['pending','confirmed','processing','shipped','delivered'];

export default function OrderStatusTimeline({ status }) {
  if (status === 'cancelled') 
    return <div className="text-red-600 font-semibold">Order cancelled</div>;

  const idx = STEPS.indexOf(status);
  
  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {STEPS.map((s,i)=>(
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i<=idx?'bg-indigo-600 text-white':'bg-slate-200 text-slate-500'}`}>{i+1}</div>
          <span className={`text-sm ${i<=idx?'text-indigo-700 font-semibold':'text-slate-500'}`}>{s}</span>
          {i<STEPS.length-1 && <div className={`w-8 h-0.5 ${i<idx?'bg-indigo-600':'bg-slate-200'}`}/>}
        </div>
      ))}
    </div>
  );
}
