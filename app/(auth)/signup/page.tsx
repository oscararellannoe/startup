"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setStatus("Revisa tu correo para confirmar tu cuenta.");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm text-slate-300">Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-400 focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="text-sm text-slate-300">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-400 focus:outline-none"
          required
        />
      </div>
      {status && <p className="text-xs text-emerald-300">{status}</p>}
      {error && <p className="text-xs text-rose-300">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-neon transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-500/60"
      >
        {loading ? "Creando..." : "Crear cuenta"}
      </button>
      <p className="text-center text-xs text-slate-400">
        ¿Ya tienes cuenta? <Link href="/login" className="text-indigo-300">Inicia sesión</Link>
      </p>
    </form>
  );
}
