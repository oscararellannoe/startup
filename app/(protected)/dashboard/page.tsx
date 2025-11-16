"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/hooks/useUser";
import type { AiLifePlan } from "@/types/plan";
import { LogoutButton } from "@/components/LogoutButton";
import { exportPlanToPdf } from "@/lib/exportPlanToPdf";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [plans, setPlans] = useState<AiLifePlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const fetchPlans = async () => {
      setLoadingPlans(true);
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setPlans(data ?? []);
      }
      setLoadingPlans(false);
    };

    fetchPlans();
  }, [user]);

  const formattedPlans = useMemo(
    () =>
      plans.map((plan) => ({
        ...plan,
        createdLabel: format(new Date(plan.created_at), "d MMMM yyyy, HH:mm", { locale: es }),
      })),
    [plans]
  );

  const handleLoadPlan = (plan: AiLifePlan) => {
    localStorage.setItem("ai-life-organizer-current-plan", JSON.stringify(plan));
    router.push("/#generador");
  };

  const handleDeletePlan = async (plan: AiLifePlan) => {
    const confirmation = confirm(`¿Eliminar "${plan.name}"?`);
    if (!confirmation) return;
    const { error } = await supabase.from("plans").delete().eq("id", plan.id);
    if (error) {
      setError(error.message);
      return;
    }
    setPlans((prev) => prev.filter((item) => item.id !== plan.id));
  };

  const handleExport = (plan: AiLifePlan) => {
    exportPlanToPdf(plan.name, plan.inputs_json.outputs);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night-900">
        <p className="text-sm text-slate-300">Cargando tu sesión...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-night-900 px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">Dashboard</p>
            <h1 className="text-3xl font-semibold text-white">Tu espacio de claridad</h1>
            <p className="mt-1 text-sm text-slate-300">Organiza planes, descárgalos y vuelve a tu ritual semanal.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 px-4 py-2 text-white/80">{user.email}</span>
            <LogoutButton />
          </div>
        </header>

        <section className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-[2fr,1fr]">
          <div>
            <h2 className="text-xl font-semibold text-white">Generador inteligente</h2>
            <p className="mt-1 text-sm text-slate-300">Vuelve al generador para crear nuevas versiones y sincronizarlas.</p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link
              href="/#generador"
              className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-neon transition hover:bg-indigo-400"
            >
              Ir al generador
            </Link>
            <p className="text-xs text-slate-400">Consejo: guarda tus iteraciones con nombres cortos.</p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Planes guardados</h2>
              <p className="text-sm text-slate-300">Gestiona, exporta y carga tus escenarios personales.</p>
            </div>
            {loadingPlans && <p className="text-xs text-slate-400">Cargando...</p>}
          </div>
          {error && <p className="mt-4 text-xs text-rose-300">{error}</p>}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {formattedPlans.map((plan) => (
              <article key={plan.id} className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-night-900/60 p-5">
                <div>
                  <p className="text-lg font-semibold text-white">{plan.name}</p>
                  <p className="text-xs text-slate-400">{plan.createdLabel}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="rounded-full border border-white/10 px-3 py-1">Ingresos: {plan.inputs_json.inputs.ingresos}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">Meta: {plan.inputs_json.inputs.metas}</span>
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadPlan(plan)}
                    className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                  >
                    Cargar en el generador
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport(plan)}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                  >
                    Exportar PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(plan)}
                    className="rounded-full border border-rose-400/30 bg-rose-500/20 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-500/30"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
            {!formattedPlans.length && !loadingPlans && (
              <p className="rounded-3xl border border-dashed border-white/10 p-6 text-sm text-slate-400">
                Aún no tienes planes guardados. Genera uno nuevo y guárdalo para verlo aquí.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
