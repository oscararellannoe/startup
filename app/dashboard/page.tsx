"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabaseClient";

interface Plan {
  id: string;
  name: string;
  inputs_json?: {
    details?: string;
  } | null;
}

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    details: ""
  });

  const fetchPlans = async () => {
    if (!user) return;
    setLoadingPlans(true);
    try {
      const response = await fetch("/api/plans/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id })
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "No pudimos cargar tus planes");
      setPlans(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  const handleCreatePlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setError("");
    setSuccess("");
    setCreating(true);
    try {
      const response = await fetch("/api/plans/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: formState.name,
          inputs_json: { details: formState.details }
        })
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "No pudimos guardar tu plan");
      setFormState({ name: "", details: "" });
      setSuccess("Plan guardado correctamente");
      await fetchPlans();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">
        Verificando sesión...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-center">
        <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-white/10 bg-slate-900/60 p-10">
          <h1 className="text-3xl font-semibold text-white">Necesitas iniciar sesión</h1>
          <p className="text-sm text-slate-400">Conecta tu cuenta para ver y crear planes.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/login" className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white">
              Iniciar sesión
            </Link>
            <Link href="/signup" className="rounded-2xl border border-white/15 px-5 py-3 text-sm text-slate-100">
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-indigo-300">Hola {user.email}</p>
            <h1 className="text-3xl font-semibold text-white">Tu dashboard</h1>
            <p className="text-sm text-slate-400">Administra tus planes guardados en Supabase.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/15 px-5 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Cerrar sesión
          </button>
        </div>

        <section className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={handleCreatePlan} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm font-semibold text-indigo-300">Nuevo plan</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Agrega un plan personalizado</h2>
            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className="text-sm text-slate-200">
                  Nombre del plan
                </label>
                <input
                  id="name"
                  required
                  value={formState.name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white focus:border-indigo-400 focus:outline-none"
                  placeholder="Plan semanal de hábitos"
                />
              </div>
              <div>
                <label htmlFor="details" className="text-sm text-slate-200">
                  Detalles (ingresos, hábitos, agenda)
                </label>
                <textarea
                  id="details"
                  required
                  rows={6}
                  value={formState.details}
                  onChange={(event) => setFormState((prev) => ({ ...prev, details: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white focus:border-indigo-400 focus:outline-none"
                  placeholder="Ingreso mensual, hábitos matutinos, bloques de foco..."
                />
              </div>
              {error && <p className="text-sm text-red-300">{error}</p>}
              {success && <p className="text-sm text-emerald-300">{success}</p>}
              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:opacity-60"
              >
                {creating ? "Guardando..." : "Guardar plan"}
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-300">Historial</p>
                <h2 className="text-2xl font-semibold text-white">Tus planes guardados</h2>
              </div>
              <button
                onClick={fetchPlans}
                className="rounded-full border border-white/15 px-4 py-2 text-xs text-slate-200 transition hover:bg-white/10"
              >
                Actualizar
              </button>
            </div>
            {loadingPlans ? (
              <p className="mt-6 text-sm text-slate-400">Cargando planes...</p>
            ) : plans.length === 0 ? (
              <p className="mt-6 text-sm text-slate-400">Todavía no tienes planes guardados.</p>
            ) : (
              <ul className="mt-6 space-y-4">
                {plans.map((plan) => (
                  <li key={plan.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-base font-semibold text-white">{plan.name}</p>
                    <p className="mt-2 whitespace-pre-line text-sm text-slate-300">
                      {plan.inputs_json?.details || "Sin detalles"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
