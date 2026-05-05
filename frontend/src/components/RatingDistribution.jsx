import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function RatingDistribution({ distribution }) {
  const data = Object.entries(distribution || {}).map(([rating, count]) => ({
    rating: `${rating} star`,
    count,
  }));

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-base font-semibold">Rating Distribution</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#0f172a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RatingDistribution;
