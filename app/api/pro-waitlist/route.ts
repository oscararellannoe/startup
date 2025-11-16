import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }

    const { error } = await supabase.from("pro_waitlist").insert({ email, source });
    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
