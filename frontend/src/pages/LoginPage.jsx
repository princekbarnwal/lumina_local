import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, authStorage } from "../services/api.js";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await api.login({ email, password });
      authStorage.setToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="glass-panel mx-auto max-w-md p-6">
      <h2 className="text-2xl font-bold tracking-tight">Business Login</h2>
      <p className="mt-1 text-sm text-slate-500">Login to manage products and view insights.</p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Email"
          className="field"
          required
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Password"
          className="field"
          required
        />

        {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

        <button
          type="submit"
          className="primary-action w-full"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">
        New business user?{" "}
        <Link to="/signup" className="font-medium text-slate-900 underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
