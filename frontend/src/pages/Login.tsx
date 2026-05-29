import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { FormField } from "../components/FormField";
import { useAuthStore } from "../store/authStore";

export function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ email: "admin@tracker.com", password: "Admin@123" });
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const data = await login(form);
      setAuth(data.accessToken, data.user);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="grid w-full max-w-md gap-4 rounded-lg border border-line bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-ink/60">Manage team work across projects.</p>
        </div>
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <FormField label="Email">
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
        <FormField label="Password">
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </FormField>
        <button className="rounded-md bg-brand px-4 py-2 font-semibold text-white">Login</button>
        <Link className="text-sm font-medium text-brand" to="/register">Create an account</Link>
      </form>
    </div>
  );
}
