import { Link } from "react-router-dom";
import { BarChart3, ClipboardCheck, LineChart } from "lucide-react";
import { authStorage } from "../services/api.js";

function HomePage() {
  const isLoggedIn = Boolean(authStorage.getToken());

  return (
    <div className="space-y-8">
      <section className="grid gap-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            Understand customer feedback without reading every review.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Track ratings, sentiment, trends, spam signals, and AI-generated business insights for
            your local shop.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to={isLoggedIn ? "/dashboard" : "/login"}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {isLoggedIn ? "Open Dashboard" : "Business Login"}
            </Link>
            <Link
              to="/signup"
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Business users can manage</p>
          <div className="mt-4 space-y-3">
            {[
              { icon: BarChart3, label: "Dashboard analytics" },
              { icon: LineChart, label: "Trend alerts" },
              { icon: ClipboardCheck, label: "Product review QR pages" },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex items-center gap-3 rounded-md bg-slate-50 p-3">
                  <Icon className="h-5 w-5 text-slate-700" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
