"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/lib/supabaseClient";
import type { AiLifePlan, PlanInputs, PlanOutputs } from "@/types/plan";
import { useUser } from "@/hooks/useUser";

const localPlansKey = "ai-life-organizer-local-plans";

const defaultInputs: PlanInputs = {
  ingresos: 0,
  gastos: 0,
  metas: "Mejorar mi balance este mes",
  horarioDisponible: "Mañanas y noches",
  areaMejorar: "Productividad personal",
  nivelCaos: "Medio",
};

const initialOutputs: PlanOutputs = {
  finanzas: "Completa el formulario para generar un diagnóstico financiero.",
  habitos: "Aquí verás hábitos accionables alineados con tus metas.",
  horario: "Se generará un horario recomendado según tu disponibilidad.",
  sieteDias: "Obtendrás prioridades concretas para los próximos 7 días.",
};

const formatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function PlanGenerator() {
  const { user } = useUser();
  const [inputs, setInputs] = useState<PlanInputs>(defaultInputs);
  const [planName, setPlanName] = useState("Mi plan de claridad");
  const [outputs, setOutputs] = useState<PlanOutputs>(initialOutputs);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [plans, setPlans] = useState<AiLifePlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(localPlansKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AiLifePlan[];
        setPlans(parsed);
      } catch (error) {
        setMessage("No pudimos leer tus planes locales.");
      }
    }
  }, []);

  useEffect(() => {
    const storedPlan = localStorage.getItem("ai-life-organizer-current-plan");
    if (storedPlan) {
      try {
        const plan = JSON.parse(storedPlan) as AiLifePlan;
        setInputs(plan.inputs_json.inputs);
        setOutputs(plan.inputs_json.outputs);
        setPlanName(plan.name);
        setMessage(`Plan "${plan.name}" cargado desde el dashboard.`);
      } catch (error) {
        setMessage("No pudimos cargar el plan solicitado.");
      } finally {
        localStorage.removeItem("ai-life-organizer-current-plan");
      }
    }
  }, []);

  const storeLocalPlans = useCallback((data: AiLifePlan[]) => {
    localStorage.setItem(localPlansKey, JSON.stringify(data));
  }, []);

  const generateOutputs = useCallback((values: PlanInputs): PlanOutputs => {
    const balance = values.ingresos - values.gastos;
    const ahorro = Math.max(balance * 0.2, 50);
    const metaFinanzas = `Tu balance mensual aproximado es ${formatter.format(
      balance
    )}. Reserva al menos ${formatter.format(
      ahorro
    )} para un fondo de tranquilidad y asigna porcentajes claros: 50% necesidades, 30% deseos, 20% objetivos.`;

    const habitos = `Enfócate en ${values.areaMejorar.toLowerCase()} con un ritual de inicio de día (5 minutos de respiración + revisión de metas), un cierre digital a las 21:00 y una revisión semanal los domingos.`;

    const horario = `Tu ventana principal es ${values.horarioDisponible.toLowerCase()}. Bloquea sprints de 90 minutos para tus metas y agrega recordatorios ligeros entre tareas para bajar el nivel de caos ${values.nivelCaos.toLowerCase()}.`;

    const sieteDias = `1) Ajusta presupuesto con tus ingresos actuales. 2) Agenda una reunión contigo para revisar tus metas '${values.metas}'. 3) Dedica un bloque creativo al día para mover el proyecto clave. 4) Realiza una caminata consciente de 15 minutos. 5) Define dos acciones delegables. 6) Limpia tu bandeja digital. 7) Celebra una victoria pequeña.`;

    return {
      finanzas: metaFinanzas,
      habitos,
      horario,
      sieteDias,
    };
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setMessage(null);
    setTimeout(() => {
      const generated = generateOutputs(inputs);
      setOutputs(generated);
      setIsGenerating(false);
      setMessage("Plan actualizado. Ajusta los detalles y guarda tus avances.");
    }, 600);
  };

  const syncPlanList = useCallback(
    (plan: AiLifePlan) => {
      setPlans((prev) => {
        const next = [plan, ...prev];
        storeLocalPlans(next);
        return next;
      });
    },
    [storeLocalPlans]
  );

  const handleSavePlan = async () => {
    if (!planName.trim()) {
      setMessage("Ponle un nombre a tu plan para guardarlo.");
      return;
    }

    const newPlan: AiLifePlan = {
      id: crypto.randomUUID(),
      user_id: user?.id ?? "local",
      name: planName.trim(),
      inputs_json: { inputs, outputs },
      created_at: new Date().toISOString(),
    };

    syncPlanList(newPlan);
    setMessage("Plan guardado localmente.");

    if (user) {
      try {
        const { error } = await supabase.from("plans").insert({
          user_id: user.id,
          name: newPlan.name,
          inputs_json: newPlan.inputs_json,
        });
        if (error) throw error;
        const { data } = await supabase
          .from("plans")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);
        if (data) {
          setPlans(data);
          storeLocalPlans(data);
        }
        setMessage("Plan sincronizado en la nube.");
      } catch (error) {
        setMessage((error as Error).message || "No pudimos guardar en Supabase.");
      }
    }
  };

  const formattedPlans = useMemo(
    () =>
      plans.slice(0, 3).map((plan) => ({
        ...plan,
        createdLabel: format(new Date(plan.created_at), "d MMMM, HH:mm", { locale: es }),
      })),
    [plans]
  );

  const loadPlan = (plan: AiLifePlan) => {
    setInputs(plan.inputs_json.inputs);
    setOutputs(plan.inputs_json.outputs);
    setPlanName(plan.name);
    setMessage(`Plan "${plan.name}" listo para seguir editando.`);
  };

  useEffect(() => {
    if (!user) return;

    const fetchCloudPlans = async () => {
      setLoadingPlans(true);
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (!error && data) {
        setPlans(data);
        storeLocalPlans(data);
      }
      setLoadingPlans(false);
    };

    fetchCloudPlans();
  }, [user, storeLocalPlans]);

  return (
    <section id="generador" className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-[#060b1d] p-8 shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Modo claridad</p>
          <h2 className="text-3xl font-semibold text-white">Diseña un plan integral</h2>
          <p className="mt-2 text-sm text-slate-300">
            Compara tus ingresos vs gastos, define prioridades y obtén acciones semanales.
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-neon transition hover:bg-indigo-400"
          disabled={isGenerating}
        >
          {isGenerating ? "Calculando..." : "Generar plan"}
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Nombre del plan</label>
            <input
              value={planName}
              onChange={(event) => setPlanName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-400 focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              Ingresos mensuales
              <input
                type="number"
                value={inputs.ingresos}
                onChange={(event) => setInputs((prev) => ({ ...prev, ingresos: Number(event.target.value) }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-400 focus:outline-none"
              />
            </label>
            <label className="text-sm text-slate-300">
              Gastos mensuales
              <input
                type="number"
                value={inputs.gastos}
                onChange={(event) => setInputs((prev) => ({ ...prev, gastos: Number(event.target.value) }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-400 focus:outline-none"
              />
            </label>
          </div>
          <label className="text-sm text-slate-300">
            Meta principal
            <input
              value={inputs.metas}
              onChange={(event) => setInputs((prev) => ({ ...prev, metas: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-slate-300">
            Horarios disponibles
            <input
              value={inputs.horarioDisponible}
              onChange={(event) => setInputs((prev) => ({ ...prev, horarioDisponible: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-slate-300">
            Área a mejorar
            <input
              value={inputs.areaMejorar}
              onChange={(event) => setInputs((prev) => ({ ...prev, areaMejorar: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-slate-300">
            Nivel de caos percibido
            <select
              value={inputs.nivelCaos}
              onChange={(event) => setInputs((prev) => ({ ...prev, nivelCaos: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-400 focus:outline-none"
            >
              <option value="Bajo" className="bg-night-900">
                Bajo
              </option>
              <option value="Medio" className="bg-night-900">
                Medio
              </option>
              <option value="Alto" className="bg-night-900">
                Alto
              </option>
            </select>
          </label>
          <button
            type="button"
            onClick={handleSavePlan}
            className="w-full rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-neon transition hover:bg-indigo-400"
          >
            Guardar plan
          </button>
          {message && <p className="text-xs text-emerald-300">{message}</p>}
        </form>
        <div className="space-y-5">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white">Plan financiero</h3>
            <p className="mt-3 text-sm text-slate-300">{outputs.finanzas}</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white">Hábitos esenciales</h3>
            <p className="mt-3 text-sm text-slate-300">{outputs.habitos}</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white">Horario recomendado</h3>
            <p className="mt-3 text-sm text-slate-300">{outputs.horario}</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white">Prioridades 7 días</h3>
            <p className="mt-3 text-sm text-slate-300">{outputs.sieteDias}</p>
          </article>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Planes recientes</h3>
          {loadingPlans && <p className="text-xs text-slate-400">Sincronizando...</p>}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {formattedPlans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => loadPlan(plan)}
              className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-indigo-400"
            >
              <p className="text-sm font-semibold text-white">{plan.name}</p>
              <p className="text-xs text-slate-400">{plan.createdLabel}</p>
            </button>
          ))}
          {!formattedPlans.length && (
            <p className="rounded-3xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
              Guarda tus primeros planes para verlos aquí.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
