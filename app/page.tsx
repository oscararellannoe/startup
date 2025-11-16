import Link from "next/link";
import { NavBar } from "./components/NavBar";

const featureCards = [
  {
    title: "Planes financieros",
    description: "Organiza ingresos, gastos y objetivos a corto plazo.",
  },
  {
    title: "Hábitos saludables",
    description: "Define rituales diarios y recordatorios alineados a tus metas.",
  },
  {
    title: "Agenda semanal",
    description: "Bloques de trabajo profundos, descanso y foco creativo.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <NavBar />
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 pt-16">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
              Planes inteligentes
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Centraliza tus metas financieras, hábitos y agenda en minutos.
            </h1>
            <p className="text-base text-slate-300">
              Conecta tu cuenta gratis, crea planes y vuelve cuando quieras. Supabase guarda tu progreso en la nube y lo puedes
              consultar en cualquier dispositivo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
              >
                Ir al dashboard
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-2xl shadow-indigo-500/20">
            <p className="text-sm text-indigo-300">Vista previa</p>
            <div className="mt-4 space-y-4 text-sm text-slate-200">
              {featureCards.map((card) => (
                <div key={card.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-base font-semibold text-white">{card.title}</p>
                  <p className="mt-1 text-slate-400">{card.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm text-indigo-100">
              <p className="font-semibold">Supabase conectado</p>
              <p className="text-slate-200">Autenticación segura y planes sincronizados en la nube.</p>
            </div>
          </div>
        </section>
        <section className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-indigo-300">¿Cómo funciona?</p>
            <h2 className="text-3xl font-semibold text-white">Crea un plan personalizado</h2>
            <p className="text-base text-slate-300">Tres pasos rápidos para empezar a ordenar tus finanzas, hábitos y tiempo.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {["Registra tus metas", "Añade ingresos y hábitos", "Guarda y vuelve cuando quieras"].map((step, index) => (
              <div key={step} className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
                <span className="text-sm text-indigo-300">Paso {index + 1}</span>
                <p className="mt-2 text-lg font-semibold text-white">{step}</p>
                <p className="mt-2 text-sm text-slate-400">
                  La información se guarda en Supabase y se puede consultar en tu dashboard.
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
