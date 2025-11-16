import { PlanGenerator } from "@/components/forms/PlanGenerator";
import { WaitlistModal } from "@/components/modals/WaitlistModal";

const highlights = [
  {
    title: "Finanzas con foco",
    description: "Visualiza tu flujo mensual y define porcentajes inteligentes en segundos.",
  },
  {
    title: "Hábitos accionables",
    description: "Convierte tus metas en rituales sencillos que caben en tu semana real.",
  },
  {
    title: "Modo ritual semanal",
    description: "Cierra la semana con un tablero que resume prioridades y avances.",
  },
];

export default function HomePage() {
  return (
    <main className="space-y-24 pb-24 pt-16">
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-indigo-300">AI LIFE ORGANIZER</p>
        <h1 className="text-4xl font-semibold text-white md:text-6xl">
          Claridad mental para tus finanzas, hábitos y semanas.
        </h1>
        <p className="max-w-2xl text-base text-slate-300">
          Genera planes personales impulsados por IA, guarda tus escenarios en la nube y vuelve a ellos desde un dashboard
          privado. Todo con un diseño pensado para la calma.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#generador"
            className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-neon transition hover:bg-indigo-400"
          >
            Crear mi primer plan
          </a>
          <WaitlistModal />
        </div>
        <div className="grid w-full gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/5 bg-night-900/40 p-4">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <PlanGenerator />
    </main>
  );
}
