import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, Box, Home, Lightbulb, LogOut, PlusCircle } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <NavLink to="/dashboard" className="block">
            <h1 className="text-xl font-semibold">Local Sentiment</h1>
            <p className="text-sm text-slate-500">Business dashboard</p>
          </NavLink>

          <nav className="flex flex-wrap gap-2">
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              <Home className="h-4 w-4" />
              Home
            </NavLink>
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default BusinessLayout;
