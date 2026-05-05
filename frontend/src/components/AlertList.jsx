import { AlertTriangle } from "lucide-react";

function AlertList({ alerts = [] }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <h2 className="text-base font-semibold">Trend Alerts</h2>
      </div>
      {alerts.length ? (
        <ul className="space-y-2">
          {alerts.map((alert) => (
            <li key={alert} className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {alert}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No alerts yet.</p>
      )}
    </div>
  );
}

export default AlertList;
