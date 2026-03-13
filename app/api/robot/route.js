import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Variáveis do Supabase não configuradas." },
        { status: 500 }
      );
    }

    if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
      return NextResponse.json(
        { error: "Variáveis da Amadeus não configuradas." },
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: alertas, error: alertasError } = await supabase
      .from("alertas")
      .select("*");

    if (alertasError) {
      return NextResponse.json({ error: alertasError.message }, { status: 500 });
    }

    const token = await getAmadeusToken();
    const resultados = [];

    for (const alerta of alertas || []) {
      if (!alerta.user_id) continue;

      const origemCode = normalizarOrigem(alerta.origem, alerta.tipo_origem);
      const destinos = normalizarDestinos(alerta.destino, alerta.tipo_destino);

      for (const destinoCode of destinos) {
        if (!origemCode || !destinoCode || origemCode === destinoCode) continue;

        const departureDate = proximaDataBusca();

        const oferta = await buscarMelhorOferta({
          token,
          originLocationCode: origemCode,
          destinationLocationCode: destinoCode,
          departureDate,
        });

        if (!oferta) continue;

        const preco = Number(oferta.preco);
        const mediaRef = mediaReferencia(origemCode, destinoCode);
        const score = calcularScore(preco, mediaRef);
        const nivel = classificarNivel(score);

        if (score < 60) continue;

        const { data, error } = await supabase
          .from("oportunidades")
          .insert([
            {
              alerta_id: alerta.id,
              user_id: alerta.user_id,
              origem: origemCode,
              destino: destinoCode,
              preco,
              companhia: oferta.companhia,
              score,
              nivel,
              link: `https://promo-fly-o9h1.vercel.app/oportunidades`,
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
      { error: error?.message || "Erro no robô." },
      { status: 500 }
    );
  }
}

async function getAmadeusToken() {
  const response = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: AMADEUS_API_KEY,
        client_secret: AMADEUS_API_SECRET,
      }),
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(data?.error_description || data?.error || "Falha ao gerar token Amadeus.");
  }

  return data.access_token;
}

async function buscarMelhorOferta({
  token,
  originLocationCode,
  destinationLocationCode,
  departureDate,
}) {
  const url = new URL("https://test.api.amadeus.com/v2/shopping/flight-offers");
  url.searchParams.set("originLocationCode", originLocationCode);
  url.searchParams.set("destinationLocationCode", destinationLocationCode);
  url.searchParams.set("departureDate", departureDate);
  url.searchParams.set("adults", "1");
  url.searchParams.set("max", "5");
  url.searchParams.set("currencyCode", "BRL");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = await response.json();

  if (!response.ok) {
    return null;
  }

  const ofertas = json?.data || [];
  if (!ofertas.length) return null;

  const primeira = ofertas[0];
  const preco = primeira?.price?.grandTotal;
  const companhia = primeira?.validatingAirlineCodes?.[0] || "N/A";

  if (!preco) return null;

  return {
    preco,
    companhia,
  };
}

function proximaDataBusca() {
  const d = new Date();
  d.setDate(d.getDate() + 45);
  return d.toISOString().slice(0, 10);
}

function normalizarOrigem(origem, tipoOrigem) {
  if (!origem) return null;

  const valor = origem.trim().toUpperCase();

  const mapa = {
    "SÃO PAULO": "GRU",
    "SAO PAULO": "GRU",
    GRU: "GRU",
    CGH: "CGH",
    VCP: "VCP",
    RIO: "GIG",
    "RIO DE JANEIRO": "GIG",
    GIG: "GIG",
    SDU: "SDU",
    BRASILIA: "BSB",
    BSB: "BSB",
    SALVADOR: "SSA",
    SSA: "SSA",
    RECIFE: "REC",
    REC: "REC",
    FORTALEZA: "FOR",
    FOR: "FOR",
    "JOÃO PESSOA": "JPA",
    "JOAO PESSOA": "JPA",
    JPA: "JPA",
    FLORIANOPOLIS: "FLN",
    FLN: "FLN",
    "SANTA CATARINA": "FLN",
  };

  if (tipoOrigem === "aeroporto") return valor;
  return mapa[valor] || null;
}

function normalizarDestinos(destino, tipoDestino) {
  if (!destino || String(destino).trim() === "" || String(destino).toLowerCase() === "todos") {
    return ["JPA", "REC", "SSA", "MCZ"];
  }

  const valor = destino.trim().toUpperCase();

  const mapa = {
    "JOÃO PESSOA": ["JPA"],
    "JOAO PESSOA": ["JPA"],
    JPA: ["JPA"],
    RECIFE: ["REC"],
    REC: ["REC"],
    SALVADOR: ["SSA"],
    SSA: ["SSA"],
    MACEIO: ["MCZ"],
    MCZ: ["MCZ"],
    NORDESTE: ["JPA", "REC", "SSA", "MCZ", "NAT", "FOR"],
  };

  if (tipoDestino === "aeroporto") return [valor];
  return mapa[valor] || ["JPA"];
}

function mediaReferencia(origem, destino) {
  const chave = `${origem}-${destino}`;

  const medias = {
    "GRU-JPA": 750,
    "GRU-REC": 700,
    "GRU-SSA": 680,
    "GRU-MCZ": 720,
    "GIG-JPA": 800,
    "FLN-JPA": 950,
  };

  return medias[chave] || 900;
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
