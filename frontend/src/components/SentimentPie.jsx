import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  positive: "#16a34a",
  neutral: "#64748b",
  negative: "#dc2626",
};

function SentimentPie({ sentiment }) {
  const data = Object.entries(sentiment || {}).map(([name, value]) => ({
    name,
    value,
  }));
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">Sentiment Breakdown</h2>
        <span className="text-sm text-slate-500">{total} reviews</span>
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
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No sentiment data yet
          </div>
        )}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        {data.map((item) => (
          <div key={item.name} className="rounded-md bg-slate-50 p-2">
            <span className="capitalize text-slate-500">{item.name}</span>
            <p className="font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SentimentPie;
