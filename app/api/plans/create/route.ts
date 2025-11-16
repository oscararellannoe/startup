import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { user_id, name, inputs_json } = await req.json();

  const { data, error } = await supabase.from("plans").insert({
    user_id,
    name,
    inputs_json
  });

  if (error) return Response.json({ error: error.message }, { status: 400 });

  return Response.json({ data });
}
