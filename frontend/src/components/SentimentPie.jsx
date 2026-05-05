import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  positive: "#10b981",
  neutral: "#64748b",
  negative: "#ef4444",
};

function SentimentPie({ sentiment }) {
  const data = Object.entries(sentiment || {}).map(([name, value]) => ({
    name,
    value,
  }));
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="elite-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">Sentiment Breakdown</h2>
          <p className="text-sm text-slate-500">Recent customer mood</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
          {total} reviews
        </span>
      </div>
      <div className="h-64">
        {total ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-md bg-slate-50 text-sm text-slate-500">
            No sentiment data yet
          </div>
        )}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        {data.map((item) => (
          <div key={item.name} className="rounded-md bg-slate-50 p-3 transition hover:bg-white hover:shadow-sm">
            <span className="capitalize text-slate-500">{item.name}</span>
            <p className="text-lg font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SentimentPie;
