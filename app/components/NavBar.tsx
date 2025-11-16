"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";

interface Plan {
  id: string;
  name: string;
}

export function NavBar() {
  const { user, loading } = useUser();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!user) {
        setPlans([]);
        return;
      }
      setLoadingPlans(true);
      try {
        const response = await fetch("/api/plans/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id })
        });
        const json = await response.json();
        if (response.ok) {
          setPlans(json.data || []);
        } else {
          console.error(json.error);
          setPlans([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [user]);

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          Startup Planner
        </Link>
        {loading ? (
          <span className="text-sm text-slate-400">Verificando sesión...</span>
        ) : user ? (
          <div className="flex items-center gap-4">
            <div className="hidden flex-col text-right text-xs text-slate-300 sm:flex">
              <span className="font-semibold text-white">Tus planes</span>
              {loadingPlans && <span className="text-indigo-300">Cargando...</span>}
              {!loadingPlans && plans.length === 0 && (
                <span className="text-slate-500">Sin planes guardados</span>
              )}
              {!loadingPlans && plans.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {plans.slice(0, 3).map((plan) => (
                    <span
                      key={plan.id}
                      className="rounded-full border border-indigo-500/30 px-2 py-0.5 text-[11px] text-indigo-200"
                    >
                      {plan.name}
                    </span>
                  ))}
                  {plans.length > 3 && (
                    <span className="text-[11px] text-slate-400">+{plans.length - 3} más</span>
                  )}
                </div>
              )}
            </div>
            <Link
              href="/dashboard"
              className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:scale-[1.02]"
            >
              Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
            >
              Crear cuenta
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
