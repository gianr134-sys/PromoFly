import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: alertas, error: alertasError } = await supabase
      .from("alertas")
      .select("*");

    if (alertasError) {
      return NextResponse.json({ error: alertasError.message }, { status: 500 });
    }

    const resultados = [];

    for (const alerta of alertas || []) {
      if (!alerta.user_id) continue;

      const precoFake = gerarPrecoFake();
      const mediaFake = 700;

      const score = calcularScore(precoFake, mediaFake);
      const nivel = classificarNivel(score);

      if (score >= 70) {
        const { data, error } = await supabase
          .from("oportunidades")
          .insert([
            {
              alerta_id: alerta.id,
              user_id: alerta.user_id,
              origem: alerta.origem,
              destino: alerta.destino || "Todos",
              preco: precoFake,
              companhia: "Companhia Exemplo",
              score,
              nivel,
              link: "https://promo-fly-o9h1.vercel.app/alertas",
            },
          ])
          .select();

        if (!error && data?.[0]) {
          resultados.push(data[0]);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      oportunidades_criadas: resultados.length,
      resultados,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Erro no robô." },
      { status: 500 }
    );
  }
}

function gerarPrecoFake() {
  return Math.floor(Math.random() * (900 - 250 + 1)) + 250;
}

function calcularScore(precoAtual, media) {
  const desconto = ((media - precoAtual) / media) * 100;

  if (desconto >= 40) return 95;
  if (desconto >= 30) return 85;
  if (desconto >= 20) return 75;
  if (desconto >= 10) return 60;
  return 30;
}

function classificarNivel(score) {
  if (score >= 90) return "imperdivel";
  if (score >= 75) return "otima";
  if (score >= 60) return "boa";
  return "normal";
}
