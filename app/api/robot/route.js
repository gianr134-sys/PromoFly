import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🔐 ENV
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

// 🔗 Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ✈️ ROTAS (REDUZIDO PRA NÃO DAR TIMEOUT)
const ROTAS = [
  {
    origemCodigo: "GRU",
    origemNome: "São Paulo",
    destinoCodigo: "MIA",
    destinoNome: "Miami",
  },
  {
    origemCodigo: "GRU",
    origemNome: "São Paulo",
    destinoCodigo: "LIS",
    destinoNome: "Lisboa",
  },
];

// 🔗 GERAR LINK GOOGLE FLIGHTS
function gerarLinkGoogleFlights(origem, destino) {
  return `https://www.google.com/travel/flights?q=Flights%20from%20${origem}%20to%20${destino}`;
}

// 🏢 TRADUZIR COMPANHIA
function traduzirCompanhia(codigo) {
  const mapa = {
    LA: "LATAM Airlines",
    G3: "Gol Linhas Aéreas",
    AD: "Azul Linhas Aéreas",
    AA: "American Airlines",
    DL: "Delta Air Lines",
    UA: "United Airlines",
    IB: "Iberia",
    AF: "Air France",
    LH: "Lufthansa",
    TP: "TAP Air Portugal",
  };

  return mapa[codigo] || codigo;
}

// 📊 SCORE SIMPLES
function calcularScore(preco) {
  if (preco < 800) return { score: 95, nivel: "imperdível" };
  if (preco < 1200) return { score: 85, nivel: "ótima" };
  if (preco < 2000) return { score: 70, nivel: "boa" };
  return { score: 50, nivel: "regular" };
}

// 🔑 TOKEN AMADEUS
async function getAccessToken() {
  const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
  });

  const data = await res.json();
  return data.access_token;
}

// ✈️ BUSCAR VOOS
async function buscarVoos(token, origem, destino) {
  const dataIda = "2026-05-10";

  const res = await fetch(
    `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origem}&destinationLocationCode=${destino}&departureDate=${dataIda}&adults=1&max=3`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  return data.data || [];
}

// 🚀 API
export async function GET() {
  try {
    const token = await getAccessToken();

    const resultados = [];

    for (const rota of ROTAS) {
      const ofertas = await buscarVoos(
        token,
        rota.origemCodigo,
        rota.destinoCodigo
      );

      for (const oferta of ofertas) {
        const preco = parseFloat(oferta.price.total);
        const companhiaCodigo =
          oferta.validatingAirlineCodes?.[0] || "XX";

        const { score, nivel } = calcularScore(preco);

        if (score < 60) continue;

        const linkCompra = gerarLinkGoogleFlights(
          rota.origemCodigo,
          rota.destinoCodigo
        );

        const { data } = await supabase
          .from("oportunidades")
          .insert([
            {
              origem: `${rota.origemNome} (${rota.origemCodigo})`,
              destino: `${rota.destinoNome} (${rota.destinoCodigo})`,
              preco,
              companhia: traduzirCompanhia(companhiaCodigo),
              score,
              nivel,
              link: linkCompra,
            },
          ])
          .select();

        if (data?.[0]) {
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
      { error: error.message },
      { status: 500 }
    );
  }
}
