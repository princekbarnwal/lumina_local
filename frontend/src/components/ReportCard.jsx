import { Sparkles } from "lucide-react";

function ReportCard({ report }) {
  return (
    <div className="elite-card relative overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-1 bg-indigo-600" />
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-100 text-indigo-700">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold">AI Report</h2>
          <p className="text-sm text-slate-500">Business-ready interpretation</p>
        </div>
      </div>
      <p className="text-sm leading-6 text-slate-700">
        {report?.summary || "Select a product to generate a report."}
      </p>
    </div>
  );
}

export default ReportCard;
