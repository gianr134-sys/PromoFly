import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    const { origem, destino, origemTipo, destinoTipo } = body;

    if (!origem) {
      return new Response(
        JSON.stringify({ error: "Origem é obrigatória." }),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("alertas")
      .insert([
        {
          origem,
          destino: destino || null,
          tipo_destino: destinoTipo || "todos",
          tipo_data: "flexivel"
        }
      ])
      .select();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
