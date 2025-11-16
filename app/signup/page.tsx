"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState)
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "No pudimos crear tu cuenta");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-indigo-300">Bienvenido</p>
          <h1 className="text-3xl font-semibold text-white">Crea tu cuenta</h1>
          <p className="text-sm text-slate-400">Con Supabase guardamos tus planes en la nube.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="text-sm text-slate-200">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-400 focus:outline-none"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-slate-200">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={formState.password}
              onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-400 focus:outline-none"
              placeholder="********"
            />
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Ya tienes cuenta? {" "}
          <Link href="/login" className="text-indigo-300 underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
