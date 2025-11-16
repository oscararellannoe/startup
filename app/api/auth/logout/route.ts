import { supabase } from "@/lib/supabaseClient";

export async function POST() {
  await supabase.auth.signOut();
  return Response.json({ message: "Logged out" });
}
