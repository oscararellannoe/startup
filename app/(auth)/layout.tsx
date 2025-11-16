import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-night-900 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-night-800/80 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-indigo-300">AI LIFE ORGANIZER</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Tu espacio de claridad</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
