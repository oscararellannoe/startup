"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
    >
      Cerrar sesión
    </button>
  );
}
