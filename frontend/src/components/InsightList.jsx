function InsightList({ title, items = [], tone = "slate" }) {
  const toneClass = {
    green: "border-emerald-100 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
    red: "border-rose-100 bg-rose-50 text-rose-800 hover:bg-rose-100",
    blue: "border-indigo-100 bg-indigo-50 text-indigo-800 hover:bg-indigo-100",
    slate: "border-slate-100 bg-slate-50 text-slate-800 hover:bg-slate-100",
  }[tone];

  return (
    <section className="elite-card p-5">
      <h2 className="mb-3 text-base font-bold">{title}</h2>
      {items.length ? (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className={`rounded-md border px-3 py-2 text-sm font-medium transition duration-200 hover:translate-x-1 ${toneClass}`}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No items available.</p>
      )}
    </section>
  );
}

export default InsightList;
