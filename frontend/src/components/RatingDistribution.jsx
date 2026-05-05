import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function RatingDistribution({ distribution }) {
  const data = Object.entries(distribution || {}).map(([rating, count]) => ({
    rating: `${rating} star`,
    count,
  }));

  return (
    <div className="elite-card p-5">
      <div className="mb-3">
        <h2 className="text-base font-bold">Rating Distribution</h2>
        <p className="text-sm text-slate-500">Star rating spread</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RatingDistribution;
