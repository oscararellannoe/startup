import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { user_id } = await req.json();

  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("user_id", user_id);

  if (error) return Response.json({ error: error.message }, { status: 400 });

  return Response.json({ data });
}
