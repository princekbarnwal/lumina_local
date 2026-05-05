function StatCard({ label, value, subtext }) {
  return (
    <div className="elite-card group relative overflow-hidden p-5">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-indigo-100 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100" />
      <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="relative mt-3 truncate text-3xl font-extrabold tracking-tight text-slate-950">{value}</p>
      {subtext ? <p className="mt-1 text-sm text-slate-500">{subtext}</p> : null}
    </div>
  );
}

export default StatCard;
