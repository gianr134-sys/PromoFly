import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

const AEROPORTOS_POR_CIDADE = {
  "SÃO PAULO": ["GRU", "CGH", "VCP"],
  "SAO PAULO": ["GRU", "CGH", "VCP"],
  RIO: ["GIG", "SDU"],
  "RIO DE JANEIRO": ["GIG", "SDU"],
  SALVADOR: ["SSA"],
  RECIFE: ["REC"],
  FORTALEZA: ["FOR"],
  MIAMI: ["MIA"],
  LISBOA: ["LIS"],
  MADRI: ["MAD"],
  PARIS: ["CDG", "ORY"],
  ROMA: ["FCO"],
  "BUENOS AIRES": ["EZE", "AEP"],
  SANTIAGO: ["SCL"],
};

const NOME_CIDADE_POR_AEROPORTO = {
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
  ORY: "Paris",
  FCO: "Roma",
  EZE: "Buenos Aires",
  AEP: "Buenos Aires",
  SCL: "Santiago",
};

const ROTAS_PADRAO = [
  { origemTexto: "São Paulo", destinoTexto: "Salvador" },
  { origemTexto: "São Paulo", destinoTexto: "Rio de Janeiro" },
  { origemTexto: "São Paulo", destinoTexto: "Recife" },
  { origemTexto: "São Paulo", destinoTexto: "Fortaleza" },
  { origemTexto: "São Paulo", destinoTexto: "Miami" },
  { origemTexto: "São Paulo", destinoTexto: "Lisboa" },
  { origemTexto: "São Paulo", destinoTexto: "Madri" },
  { origemTexto: "São Paulo", destinoTexto: "Paris" },
  { origemTexto: "São Paulo", destinoTexto: "Roma" },
  { origemTexto: "São Paulo", destinoTexto: "Buenos Aires" },
  { origemTexto: "São Paulo", destinoTexto: "Santiago" },
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
      return NextResponse.json(
        { error: alertasError.message },
        { status: 500 }
      );
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

        const origemExibicao =
          rota.origemAeroportoUsado && rota.origemAeroportoUsado !== rota.origemNome
            ? `${rota.origemNome} (${rota.origemAeroportoUsado})`
            : rota.origemNome;

        const destinoExibicao =
          rota.destinoAeroportoUsado && rota.destinoAeroportoUsado !== rota.destinoNome
            ? `${rota.destinoNome} (${rota.destinoAeroportoUsado})`
            : rota.destinoNome;

        const { data, error } = await supabase
          .from("oportunidades")
          .insert([
            {
              alerta_id: alerta.id,
              user_id: alerta.user_id,
              origem: origemExibicao,
              destino: destinoExibicao,
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
  const origemTexto = String(alerta.origem || "").trim();
  const tipoOrigem = String(alerta.tipo_origem || "").toLowerCase();

  const destinoTextoOriginal = String(alerta.destino || "").trim();
  const destinoTexto = destinoTextoOriginal.toLowerCase();
  const tipoDestino = String(alerta.tipo_destino || "").toLowerCase();

  const origens = expandirLocal(origemTexto, tipoOrigem);
  if (!origens.length) return [];

  if (
    destinoTexto === "" ||
    destinoTexto === "todos" ||
    destinoTexto === "todos os destinos"
  ) {
    return montarRotasPadraoParaOrigens(origens);
  }

  const destinos = expandirLocal(destinoTextoOriginal, tipoDestino);
  if (!destinos.length) return [];

  const rotas = [];

  for (const origem of origens) {
    for (const destino of destinos) {
      rotas.push({
        origemNome: origem.cidadeNome,
        origemCodigo: origem.codigo,
        origemAeroportoUsado: origem.codigo,
        destinoNome: destino.cidadeNome,
        destinoCodigo: destino.codigo,
        destinoAeroportoUsado: destino.codigo,
      });
    }
  }

  return rotas;
}

function montarRotasPadraoParaOrigens(origens) {
  const rotas = [];

  for (const origem of origens) {
    for (const rotaPadrao of ROTAS_PADRAO) {
      const origemPadraoExpandida = expandirLocal(rotaPadrao.origemTexto, "estado");
      const origemPadraoCodigos = origemPadraoExpandida.map((item) => item.codigo);

      if (!origemPadraoCodigos.includes(origem.codigo)) continue;

      const destinos = expandirLocal(rotaPadrao.destinoTexto, "estado");

      for (const destino of destinos) {
        if (origem.codigo === destino.codigo) continue;

        rotas.push({
          origemNome: origem.cidadeNome,
          origemCodigo: origem.codigo,
          origemAeroportoUsado: origem.codigo,
          destinoNome: destino.cidadeNome,
          destinoCodigo: destino.codigo,
          destinoAeroportoUsado: destino.codigo,
        });
      }
    }
  }

  return rotas;
}

function expandirLocal(valor, tipo) {
  if (!valor) return [];

  const texto = String(valor).trim().toUpperCase();

  if (tipo === "aeroporto") {
    return [
      {
        codigo: texto,
        cidadeNome: nomeDoLocal(texto, valor),
      },
    ];
  }

  const aeroportos = AEROPORTOS_POR_CIDADE[texto];
  if (!aeroportos) {
    return [];
  }

  const cidadeNome = nomeCidadePorTexto(valor);

  return aeroportos.map((codigo) => ({
    codigo,
    cidadeNome,
  }));
}

function nomeCidadePorTexto(valor) {
  const texto = String(valor || "").trim().toUpperCase();

  const mapa = {
    "SÃO PAULO": "São Paulo",
    "SAO PAULO": "São Paulo",
    RIO: "Rio de Janeiro",
    "RIO DE JANEIRO": "Rio de Janeiro",
    SALVADOR: "Salvador",
    RECIFE: "Recife",
    FORTALEZA: "Fortaleza",
    MIAMI: "Miami",
    LISBOA: "Lisboa",
    MADRI: "Madri",
    PARIS: "Paris",
    ROMA: "Roma",
    "BUENOS AIRES": "Buenos Aires",
    SANTIAGO: "Santiago",
  };

  return mapa[texto] || valor;
}

function nomeDoLocal(codigo, fallback) {
  return NOME_CIDADE_POR_AEROPORTO[codigo] || fallback || codigo;
}

function traduzirCompanhia(codigo) {
  const mapa = {
    G3: "Gol Linhas Aéreas",
    LA: "LATAM Airlines",
    AD: "Azul Linhas Aéreas",
    AA: "American Airlines",
    DL: "Delta Air Lines",
    UA: "United Airlines",
    TP: "TAP Air Portugal",
    IB: "Iberia",
    AF: "Air France",
    KL: "KLM",
    AZ: "ITA Airways",
    LH: "Lufthansa",
    BA: "British Airways",
    CA: "Air China",
    QR: "Qatar Airways",
    EK: "Emirates",
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
    "CGH-SSA": 720,
    "VCP-SSA": 680,

    "GRU-GIG": 400,
    "CGH-GIG": 390,
    "VCP-GIG": 420,

    "GRU-SDU": 380,
    "CGH-SDU": 360,
    "VCP-SDU": 410,

    "GRU-REC": 700,
    "CGH-REC": 720,
    "VCP-REC": 680,

    "GRU-FOR": 750,
    "CGH-FOR": 770,
    "VCP-FOR": 730,

    "GRU-MIA": 2800,
    "VCP-MIA": 2600,

    "GRU-LIS": 3500,
    "VCP-LIS": 3200,

    "GRU-MAD": 3400,
    "VCP-MAD": 3100,

    "GRU-CDG": 4200,
    "GRU-ORY": 4000,
    "VCP-CDG": 3900,

    "GRU-FCO": 3900,
    "VCP-FCO": 3600,

    "GRU-EZE": 1600,
    "GRU-AEP": 1500,

    "GRU-SCL": 1800,
    "VCP-SCL": 1700,
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
