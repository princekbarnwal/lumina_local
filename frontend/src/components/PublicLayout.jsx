import { NavLink, Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <NavLink to="/" className="block">
            <h1 className="text-xl font-bold tracking-tight">Local Sentiment</h1>
            <p className="text-sm text-slate-500">Customer feedback intelligence</p>
          </NavLink>
          <nav className="flex gap-2">
            <NavLink
              to="/login"
              className="secondary-action px-3"
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="primary-action px-3"
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
