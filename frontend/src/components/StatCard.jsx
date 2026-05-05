function StatCard({ label, value, subtext }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      {subtext ? <p className="mt-1 text-sm text-slate-500">{subtext}</p> : null}
    </div>
  );
}

export default StatCard;
