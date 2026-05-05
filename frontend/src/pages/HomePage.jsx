import { Link } from "react-router-dom";
import { BarChart3, ClipboardCheck, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { authStorage } from "../services/api.js";

const features = [
  { icon: BarChart3, label: "Unified Analytics", text: "Ratings, sentiment, and review volume in one dashboard." },
  { icon: Sparkles, label: "AI Insights", text: "Summaries, positives, negatives, and suggested actions." },
  { icon: LineChart, label: "Trend Alerts", text: "Detect rating drops, sentiment shifts, and feedback spikes." },
  { icon: ClipboardCheck, label: "QR Campaigns", text: "Collect product-level feedback from customers instantly." },
];

function HomePage() {
  const isLoggedIn = Boolean(authStorage.getToken());

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-xl border border-white/70 bg-slate-950 px-6 py-10 text-white shadow-2xl shadow-slate-950/20 md:px-10 md:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.45),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(20,184,166,0.25),transparent_28%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100 backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Sentiment Elite for local businesses
            </div>
            <h2 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
              Turn every review into a business growth signal.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Local Sentiment helps owners and managers understand customer intent, detect trend
              changes, and act faster without reading hundreds of comments manually.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={isLoggedIn ? "/dashboard" : "/login"} className="primary-action">
                {isLoggedIn ? "Open Dashboard" : "Business Login"}
              </Link>
              <Link to="/signup" className="secondary-action border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-950">
                Create Account
              </Link>
            </div>
          </div>

          <div className="glass-panel bg-white/10 p-5 text-white">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-indigo-100">Avg Rating</p>
                <p className="mt-2 text-3xl font-extrabold">4.7</p>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-indigo-100">Sentiment</p>
                <p className="mt-2 text-3xl font-extrabold">82%</p>
              </div>
              <div className="col-span-2 rounded-lg bg-white p-4 text-slate-950">
                <p className="text-sm font-semibold text-slate-500">AI recommendation</p>
                <p className="mt-2 text-sm leading-6">
                  Promote best-rated products and respond to recent service-speed complaints this week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article key={feature.label} className="elite-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100 text-indigo-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold">{feature.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{feature.text}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default HomePage;
