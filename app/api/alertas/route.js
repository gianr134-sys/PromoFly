import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  return NextResponse.json(
    { ok: true, message: "API de alertas funcionando." },
    { status: 200 }
  );
}

export async function POST(request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "Variáveis do Supabase não configuradas.",
          debug: {
            hasSupabaseUrl: !!supabaseUrl,
            hasSupabaseKey: !!supabaseKey,
          },
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const origem = body.origem || null;
    const destino = body.destino || null;
    const origemTipo = body.origemTipo || "estado";
    const destinoTipo = body.destinoTipo || "todos";

    if (!origem) {
      return NextResponse.json(
        { error: "Origem é obrigatória." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("alertas")
      .insert([
        {
          origem,
          destino,
          tipo_origem: origemTipo,
          tipo_destino: destinoTipo,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: err?.message || "Erro interno no servidor.",
      },
      { status: 500 }
    );
  }
}
