import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { FormField } from "../components/FormField";
import { useAuthStore } from "../store/authStore";

export function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ name: "", email: "", password: "", organizationName: "" });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = await register(form);
    setAuth(data.accessToken, data.user);
    navigate("/");
  };

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="grid w-full max-w-md gap-4 rounded-lg border border-line bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Create workspace</h1>
        <FormField label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
        <FormField label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
        <FormField label="Password"><input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></FormField>
        <FormField label="Organization"><input value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} /></FormField>
        <button className="rounded-md bg-brand px-4 py-2 font-semibold text-white">Register</button>
        <Link className="text-sm font-medium text-brand" to="/login">Already have an account?</Link>
      </form>
    </div>
  );
}
