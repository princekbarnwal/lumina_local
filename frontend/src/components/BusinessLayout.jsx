import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, Box, Home, Lightbulb, LogOut, PlusCircle, Sparkles } from "lucide-react";
import { authStorage } from "../services/api.js";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/products", label: "Products", icon: Box },
  { to: "/products/add", label: "Add Product", icon: PlusCircle },
  { to: "/insights", label: "Insights", icon: Lightbulb },
];

function BusinessLayout() {
  const navigate = useNavigate();

  const logout = () => {
    authStorage.clearToken();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-slate-900">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-72 p-4 lg:block">
        <aside className="glass-panel flex h-full flex-col p-4">
          <NavLink to="/dashboard" className="group flex items-center gap-3 rounded-lg p-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 transition duration-300 group-hover:rotate-3 group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Local Sentiment</h1>
              <p className="text-xs font-medium text-slate-500">Sentiment Elite</p>
            </div>
          </NavLink>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition duration-200 ${
                      isActive
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
                        : "text-slate-600 hover:bg-white hover:text-indigo-700 hover:shadow-sm"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 transition duration-200 group-hover:scale-110" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto space-y-2">
            <NavLink to="/" className="secondary-action w-full">
              <Home className="h-4 w-4" />
              Public Home
            </NavLink>
            <button type="button" onClick={logout} className="secondary-action w-full">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>
      </div>

      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <NavLink to="/dashboard">
            <h1 className="text-lg font-bold">Local Sentiment</h1>
            <p className="text-xs text-slate-500">Sentiment Elite</p>
          </NavLink>
          <button type="button" onClick={logout} className="secondary-action px-3">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
                    isActive ? "bg-slate-950 text-white" : "bg-white text-slate-700"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </header>

      <main className="px-4 py-6 lg:ml-72 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default BusinessLayout;
