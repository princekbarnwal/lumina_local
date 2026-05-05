import { LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { api, authStorage } from "../services/api.js";

function AuthPanel({ onAuthChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const hasToken = Boolean(authStorage.getToken());

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const data = await api.login({ email, password });
      authStorage.setToken(data.token);
      setPassword("");
      onAuthChange?.();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleLogout = () => {
    authStorage.clearToken();
    onAuthChange?.();
  };

  if (hasToken) {
    return (
      <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">Authenticated for business APIs.</p>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="rounded-md border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Business email"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Password"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <LogIn className="h-4 w-4" />
          Login
        </button>
      </div>
      {message ? <p className="mt-2 text-sm text-red-600">{message}</p> : null}
    </form>
  );
}

export default AuthPanel;
