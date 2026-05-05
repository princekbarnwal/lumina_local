import { NavLink, Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <NavLink to="/" className="block">
            <h1 className="text-xl font-semibold">Local Sentiment</h1>
            <p className="text-sm text-slate-500">Customer feedback intelligence</p>
          </NavLink>
          <nav className="flex gap-2">
            <NavLink
              to="/login"
              className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Signup
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
