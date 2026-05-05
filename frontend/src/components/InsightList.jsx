function InsightList({ title, items = [], tone = "slate" }) {
  const toneClass = {
    green: "bg-green-50 text-green-800",
    red: "bg-red-50 text-red-800",
    blue: "bg-blue-50 text-blue-800",
    slate: "bg-slate-50 text-slate-800",
  }[tone];

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-base font-semibold">{title}</h2>
      {items.length ? (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className={`rounded-md px-3 py-2 text-sm ${toneClass}`}>
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
