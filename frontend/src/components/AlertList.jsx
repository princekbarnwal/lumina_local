import { AlertTriangle } from "lucide-react";

function AlertList({ alerts = [] }) {
  return (
    <div className="elite-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-100 text-amber-700">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold">Trend Alerts</h2>
          <p className="text-sm text-slate-500">Changes that need attention</p>
        </div>
      </div>
      {alerts.length ? (
        <ul className="space-y-2">
          {alerts.map((alert) => (
            <li
              key={alert}
              className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 transition hover:translate-x-1 hover:bg-amber-100"
            >
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
