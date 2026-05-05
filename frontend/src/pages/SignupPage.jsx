import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.signup({ email, password });
      setMessage("Account created. You can login now.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="glass-panel mx-auto max-w-md p-6">
      <h2 className="text-2xl font-bold tracking-tight">Create Business Account</h2>
      <p className="mt-1 text-sm text-slate-500">Signup to create shops and products.</p>

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

        {message ? <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</div> : null}
        {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

        <button
          type="submit"
          className="primary-action w-full"
        >
          Signup
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-slate-900 underline">
          Login
        </Link>
      </p>
    </div>
  );
}

export default SignupPage;
