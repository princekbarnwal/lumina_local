function ReportCard({ report }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <h2 className="mb-2 text-base font-semibold">AI Report</h2>
      <p className="text-sm leading-6 text-slate-700">
        {report?.summary || "Select a product to generate a report."}
      </p>
    </div>
  );
}

export default ReportCard;
