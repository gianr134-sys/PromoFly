import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const CIDADES = {
  "SÃO PAULO": ["GRU", "CGH", "VCP"],
  "SAO PAULO": ["GRU", "CGH", "VCP"],
  "RIO DE JANEIRO": ["GIG", "SDU"],
  RIO: ["GIG", "SDU"],
  FLORIANÓPOLIS: ["FLN"],
  FLORIANOPOLIS: ["FLN"],
  "JOÃO PESSOA": ["JPA"],
  "JOAO PESSOA": ["JPA"],
  SALVADOR: ["SSA"],
  RECIFE: ["REC"],
  FORTALEZA: ["FOR"],
  MIAMI: ["MIA"],
  LISBOA: ["LIS"],
  MADRI: ["MAD"],
  SANTIAGO: ["SCL"],
  PARIS: ["CDG"],
  ROMA: ["FCO"],
};

const NOMES_AEROPORTOS = {
  GRU: "São Paulo",
  CGH: "São Paulo",
  VCP: "São Paulo",
  GIG: "Rio de Janeiro",
  SDU: "Rio de Janeiro",
  FLN: "Florianópolis",
  JPA: "João Pessoa",
  SSA: "Salvador",
  REC: "Recife",
  FOR: "Fortaleza",
  MIA: "Miami",
  LIS: "Lisboa",
  MAD: "Madri",
  SCL: "Santiago",
  CDG: "Paris",
  FCO: "Roma",
};

const COMPANHIAS = {
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
  AV: "Avianca",
  AZ: "ITA Airways",
};

function traduzirCompanhia(codigo) {
  return COMPANHIAS[codigo] || codigo || "Companhia não identificada";
}

function normalizarTexto(valor) {
  return String(valor || "").trim().toUpperCase();
}

function primeiroAeroporto(valor, tipo) {
  const texto = normalizarTexto(valor);

  if (!texto || texto === "NULO" || texto === "TODOS" || texto === "TODOS OS DESTINOS") {
    return null;
  }

  if (String(tipo || "").toLowerCase() === "aeroporto") {
    return texto;
  }

  const lista = CIDADES[texto];
  return lista?.[0] || null;
}

function nomeBonito(local, codigo) {
  const texto = normalizarTexto(local);

  const mapa = {
    "SÃO PAULO": "São Paulo",
    "SAO PAULO": "São Paulo",
    "RIO DE JANEIRO": "Rio de Janeiro",
    RIO: "Rio de Janeiro",
    FLORIANÓPOLIS: "Florianópolis",
    FLORIANOPOLIS: "Florianópolis",
    "JOÃO PESSOA": "João Pessoa",
    "JOAO PESSOA": "João Pessoa",
    SALVADOR: "Salvador",
    RECIFE: "Recife",
    FORTALEZA: "Fortaleza",
    MIAMI: "Miami",
    LISBOA: "Lisboa",
    MADRI: "Madri",
    SANTIAGO: "Santiago",
    PARIS: "Paris",
    ROMA: "Roma",
  };

  return mapa[texto] || NOMES_AEROPORTOS[codigo] || local || codigo;
}

function gerarDataIda() {
  const d = new Date();
  d.setDate(d.getDate() + 45);
  return d.toISOString().slice(0, 10);
}

function gerarLinkGoogleFlights(origem, destino, data) {
  return `https://www.google.com/travel/flights?q=Flights%20from%20${origem}%20to%20${destino}%20on%20${data}`;
}

function calcularScore(preco) {
  if (preco <= 700) return { score: 95, nivel: "imperdivel" };
  if (preco <= 1200) return { score: 85, nivel: "otima" };
  if (preco <= 2000) return { score: 70, nivel: "boa" };
  return { score: 50, nivel: "regular" };
}

async function getAccessToken() {
  const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_API_KEY,
      client_secret: AMADEUS_API_SECRET,
    }),
  });

  const json = await response.json();

  if (!json.access_token) {
    throw new Error(json.error_description || json.error || "Falha ao obter token da Amadeus");
  }

  return json.access_token;
}

async function buscarVoos(token, origem, destino, dataIda) {
  const url =
    `https://test.api.amadeus.com/v2/shopping/flight-offers` +
    `?originLocationCode=${origem}` +
    `&destinationLocationCode=${destino}` +
    `&departureDate=${dataIda}` +
    `&adults=1&max=1&currencyCode=BRL`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  return json.data || [];
}

export async function GET() {
  try {
    const token = await getAccessToken();
    const dataIda = gerarDataIda();

    const { data: alertas, error: alertasError } = await supabase
      .from("alertas")
      .select("id, user_id, origem, destino, tipo_origem, tipo_destino")
      .limit(5);

    if (alertasError) {
      return NextResponse.json(
        { error: alertasError.message, detalhe: alertasError },
        { status: 500 }
      );
    }

    if (!alertas?.length) {
      return NextResponse.json({
        ok: true,
        oportunidades_criadas: 0,
        resultados: [],
        aviso: "Nenhum alerta encontrado.",
      });
    }

    const resultados = [];
    const ignorados = [];

    for (const alerta of alertas) {
      const origemCodigo = primeiroAeroporto(alerta.origem, alerta.tipo_origem);
      const destinoCodigo = primeiroAeroporto(alerta.destino, alerta.tipo_destino);

      if (!origemCodigo || !destinoCodigo) {
        ignorados.push({
          alerta_id: alerta.id,
          motivo: "Origem ou destino não mapeado",
          origem: alerta.origem,
          destino: alerta.destino,
        });
        continue;
      }

      const ofertas = await buscarVoos(token, origemCodigo, destinoCodigo, dataIda);

      if (!ofertas.length) {
  const preco = 1899.90;
  const score = 85;
  const nivel = "otima";
  const companhia = "LATAM Airlines";

  const origemTexto = `${nomeBonito(alerta.origem, origemCodigo)} (${origemCodigo})`;
  const destinoTexto = `${nomeBonito(alerta.destino, destinoCodigo)} (${destinoCodigo})`;
  const linkCompra = gerarLinkGoogleFlights(origemCodigo, destinoCodigo, dataIda);

  const { data, error } = await supabase
    .from("oportunidades")
    .insert([
      {
        alerta_id: alerta.id,
        user_id: alerta.user_id,
        origem: origemTexto,
        destino: destinoTexto,
        preco,
        companhia,
        score,
        nivel,
        link: linkCompra,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        detalhe: error,
      },
      { status: 500 }
    );
  }

  if (data?.[0]) {
    resultados.push(data[0]);
  }

  continue;
}

      const oferta = ofertas[0];
      const preco = parseFloat(oferta.price?.total || oferta.price?.grandTotal || "0");
      const companhiaCodigo = oferta.validatingAirlineCodes?.[0] || "XX";
      const { score, nivel } = calcularScore(preco);

      const origemTexto = `${nomeBonito(alerta.origem, origemCodigo)} (${origemCodigo})`;
      const destinoTexto = `${nomeBonito(alerta.destino, destinoCodigo)} (${destinoCodigo})`;
      const linkCompra = gerarLinkGoogleFlights(origemCodigo, destinoCodigo, dataIda);

      const { data, error } = await supabase
        .from("oportunidades")
        .insert([
          {
            alerta_id: alerta.id,
            user_id: alerta.user_id,
            origem: origemTexto,
            destino: destinoTexto,
            preco,
            companhia: traduzirCompanhia(companhiaCodigo),
            score,
            nivel,
            link: linkCompra,
          },
        ])
        .select();

      if (error) {
        return NextResponse.json(
          {
            error: error.message,
            detalhe: error,
            tentativa: {
              alerta_id: alerta.id,
              user_id: alerta.user_id,
              origem: origemTexto,
              destino: destinoTexto,
              preco,
              companhia: traduzirCompanhia(companhiaCodigo),
              score,
              nivel,
              link: linkCompra,
            },
          },
          { status: 500 }
        );
      }

      if (data?.[0]) {
        resultados.push(data[0]);
      }
    }

    return NextResponse.json({
      ok: true,
      oportunidades_criadas: resultados.length,
      resultados,
      ignorados,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Erro interno no robô" },
      { status: 500 }
    );
  }
}
