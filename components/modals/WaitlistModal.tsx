"use client";

import { useState } from "react";

export function WaitlistModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes("@")) {
      setStatus("Ingresa un correo válido.");
      setStatusType("error");
      return;
    }
    setLoading(true);
    setStatus(null);
    setStatusType(null);
    try {
      const response = await fetch("/api/pro-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "landing" }),
      });
      if (!response.ok) {
        throw new Error("No pudimos guardar tu correo.");
      }
      setStatus("Te agregamos a la lista de espera PRO.");
      setStatusType("success");
      setEmail("");
    } catch (error) {
      setStatus((error as Error).message);
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-neon transition hover:bg-indigo-400"
      >
        Lista de espera PRO
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-night-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">Beta privada</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Reserva tu lugar PRO</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setStatus(null);
                  setStatusType(null);
                }}
                className="text-slate-400 transition hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-300">
              Desbloquea historial ilimitado, integraciones y modo colaborativo apenas lancemos la versión PRO.
            </p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-neon transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-500/60"
              >
                {loading ? "Enviando..." : "Guardar mi lugar"}
              </button>
              {status && (
                <p
                  className={`text-xs ${statusType === "error" ? "text-rose-300" : "text-emerald-300"}`}
                >
                  {status}
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setStatus(null);
                  setStatusType(null);
                }}
                className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Cerrar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
