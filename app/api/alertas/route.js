import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const body = await req.json();
  const { origem, destino, tipo_destino, tipo_data } = body;

  const { data, error } = await supabase
    .from("alertas")
    .insert([{ origem, destino, tipo_destino, tipo_data }]);

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json({ success: true, data });
}
