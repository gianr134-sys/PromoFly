import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

const ROTAS_PADRAO = [
  {
    origemNome: "São Paulo",
    origemCodigo: "GRU",
    destinoNome: "Salvador",
    destinoCodigo: "SSA",
  },
  {
    origemNome: "São Paulo",
    origemCodigo: "GRU",
    destinoNome: "Rio de Janeiro",
    destinoCodigo: "GIG",
  },
  {
    origemNome: "São Paulo",
    origemCodigo: "GRU",
    destinoNome: "Recife",
    destinoCodigo: "REC",
  },
  {
    origemNome: "São Paulo",
    origemCodigo: "GRU",
    destinoNome: "Fortaleza",
    destinoCodigo: "FOR",
  },
  {
    origemNome: "São Paulo",
    origemCodigo: "GRU",
    destinoNome: "Miami",
    destinoCodigo: "MIA",
  },
  {
    origemNome: "São Paulo",
    origemCodigo: "GRU",
    destinoNome: "Lisboa",
    destinoCodigo: "LIS",
  },
  {
    origemNome: "São Paulo",
    origemCodigo: "GRU",
    destinoNome: "Madri",
    destinoCodigo: "MAD",
  },
  {
    origemNome: "São Paulo",
    origemCodigo: "GRU",
    destinoNome: "Paris",
    destinoCodigo: "CDG",
  },
  {
    origemNome: "São Paulo",
    origemCodigo: "GRU",
    destinoNome: "Roma",
    destinoCodigo: "FCO",
  },
  {
    origemNome: "São Paulo",
    origemCodigo: "GRU",
    destinoNome: "Buenos Aires",
    destinoCodigo: "EZE",
  },
  {
    origemNome: "São Paulo",
    origemCodigo: "GRU",
    destinoNome: "Santiago",
    destinoCodigo: "SCL",
  },
];

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

      const rotasDoAlerta = montarRotasDoAlerta(alerta);

      for (const rota of rotasDoAlerta) {
        if (!rota.origemCodigo || !rota.destinoCodigo) continue;
        if (rota.origemCodigo === rota.destinoCodigo) continue;

        console.log(
          `Buscando ${rota.origemNome} (${rota.origemCodigo}) → ${rota.destinoNome} (${rota.destinoCodigo})`
        );

        const departureDate = proximaDataBusca();

        const oferta = await buscarMelhorOferta({
          token,
          originLocationCode: rota.origemCodigo,
          destinationLocationCode: rota.destinoCodigo,
          departureDate,
        });

        if (!oferta) continue;

        const preco = Number(oferta.preco);
        const mediaRef = mediaReferencia(rota.origemCodigo, rota.destinoCodigo);
        const score = calcularScore(preco, mediaRef);
        const nivel = classificarNivel(score);

        if (score < 60) continue;

        const companhiaNome = traduzirCompanhia(oferta.companhia);

        const { data, error } = await supabase
          .from("oportunidades")
          .insert([
            {
              alerta_id: alerta.id,
              user_id: alerta.user_id,
              origem: rota.origemNome,
              destino: rota.destinoNome,
              preco,
              companhia: companhiaNome,
              score,
              nivel,
              link: "https://promo-fly-o9h1.vercel.app/oportunidades",
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
    throw new Error(
      data?.error_description || data?.error || "Falha ao gerar token Amadeus."
    );
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

function montarRotasDoAlerta(alerta) {
  const origemCodigo = normalizarCodigo(alerta.origem, alerta.tipo_origem);
  const origemNome = nomeDoLocal(origemCodigo, alerta.origem);

  if (!origemCodigo) return [];

  const destinoTexto = String(alerta.destino || "").trim().toLowerCase();

  if (
    destinoTexto === "" ||
    destinoTexto === "todos" ||
    destinoTexto === "todos os destinos"
  ) {
    return ROTAS_PADRAO.filter((rota) => rota.origemCodigo === origemCodigo);
  }

  const destinoCodigo = normalizarCodigo(alerta.destino, alerta.tipo_destino);
  const destinoNome = nomeDoLocal(destinoCodigo, alerta.destino);

  if (!destinoCodigo) return [];

  return [
    {
      origemNome,
      origemCodigo,
      destinoNome,
      destinoCodigo,
    },
  ];
}

function normalizarCodigo(valor, tipo) {
  if (!valor) return null;

  const texto = String(valor).trim().toUpperCase();

  const mapa = {
    "SÃO PAULO": "GRU",
    "SAO PAULO": "GRU",
    GRU: "GRU",
    CGH: "CGH",
    VCP: "VCP",

    "RIO DE JANEIRO": "GIG",
    RIO: "GIG",
    GIG: "GIG",
    SDU: "SDU",

    SALVADOR: "SSA",
    SSA: "SSA",

    RECIFE: "REC",
    REC: "REC",

    FORTALEZA: "FOR",
    FOR: "FOR",

    MIAMI: "MIA",
    MIA: "MIA",

    LISBOA: "LIS",
    LIS: "LIS",

    MADRI: "MAD",
    MADRID: "MAD",
    MAD: "MAD",

    PARIS: "CDG",
    CDG: "CDG",

    ROMA: "FCO",
    ROME: "FCO",
    FCO: "FCO",

    "BUENOS AIRES": "EZE",
    BUE: "EZE",
    EZE: "EZE",

    SANTIAGO: "SCL",
    SCL: "SCL",
  };

  if (tipo === "aeroporto") return texto;
  return mapa[texto] || null;
}

function nomeDoLocal(codigo, fallback) {
  const mapa = {
    GRU: "São Paulo",
    CGH: "São Paulo",
    VCP: "Campinas",
    GIG: "Rio de Janeiro",
    SDU: "Rio de Janeiro",
    SSA: "Salvador",
    REC: "Recife",
    FOR: "Fortaleza",
    MIA: "Miami",
    LIS: "Lisboa",
    MAD: "Madri",
    CDG: "Paris",
    FCO: "Roma",
    EZE: "Buenos Aires",
    SCL: "Santiago",
  };

  return mapa[codigo] || fallback || codigo;
}

function traduzirCompanhia(codigo) {
  const mapa = {
    G3: "Gol",
    LA: "LATAM",
    AD: "Azul",
    AA: "American Airlines",
    TP: "TAP",
    IB: "Iberia",
    AF: "Air France",
    AZ: "ITA Airways",
  };

  return mapa[codigo] || codigo;
}

function proximaDataBusca() {
  const d = new Date();
  d.setDate(d.getDate() + 45);
  return d.toISOString().slice(0, 10);
}

function mediaReferencia(origem, destino) {
  const chave = `${origem}-${destino}`;

  const medias = {
    "GRU-SSA": 700,
    "GRU-GIG": 400,
    "GRU-REC": 700,
    "GRU-FOR": 750,
    "GRU-MIA": 2800,
    "GRU-LIS": 3500,
    "GRU-MAD": 3400,
    "GRU-CDG": 4200,
    "GRU-FCO": 3900,
    "GRU-EZE": 1600,
    "GRU-SCL": 1800,
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
