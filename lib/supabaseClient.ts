import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://esbdlhqdiglixupjgqqh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYmRsaHFkaWdsaXh1cGpncXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzU2NTYsImV4cCI6MjA3ODg1MTY1Nn0.GM2UEug_Zo3BiJgdNiq_yJccwEbb_rZqPJ4fAOvpKs0"
);
