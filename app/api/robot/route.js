import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CIDADES = {
  "SÃO PAULO": ["GRU", "CGH", "VCP"],
  "SAO PAULO": ["GRU", "CGH", "VCP"],
  "RIO DE JANEIRO": ["GIG", "SDU"],
  RIO: ["GIG", "SDU"],
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

const NOMES_AEROPORTOS = {
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
  ["São Paulo", "Salvador"],
  ["São Paulo", "Rio de Janeiro"],
  ["São Paulo", "Recife"],
  ["São Paulo", "Fortaleza"],
  ["São Paulo", "Miami"],
  ["São Paulo", "Lisboa"],
  ["São Paulo", "Madri"],
  ["São Paulo", "Paris"],
  ["São Paulo", "Roma"],
  ["São Paulo", "Buenos Aires"],
  ["São Paulo", "Santiago"],
];

export async function GET() {
  try {
    const token = await getToken();

    const { data: alertas, error } = await supabase.from("alertas").select("*");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const resultados = [];

    for (const alerta of alertas || []) {
      if (!alerta.user_id) continue;

      const rotas = montarRotas(alerta);

      for (const rota of rotas) {
        const oferta = await buscarOferta(token, rota.origemCodigo, rota.destinoCodigo);
        if (!oferta) continue;

        const preco = Number(oferta.preco);
        const score = calcularScore(preco, mediaReferencia(rota.origemCodigo, rota.destinoCodigo));
        const nivel = classificarNivel(score);

        if (score < 60) continue;

        const { data } = await supabase
          .from("oportunidades")
          .insert([
            {
              alerta_id: alerta.id,
              user_id: alerta.user_id,
              origem: `${rota.origemNome} (${rota.origemCodigo})`,
              destino: `${rota.destinoNome} (${rota.destinoCodigo})`,
              preco,
              companhia: traduzirCompanhia(oferta.companhia),
              score,
              nivel,
              link: "https://promo-fly-o9h1.vercel.app/oportunidades",
            },
          ])
          .select();

        if (data?.[0]) resultados.push(data[0]);
      }
    }

    return NextResponse.json({
      ok: true,
      oportunidades_criadas: resultados.length,
      resultados,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function getToken() {
  const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_API_KEY,
      client_secret: process.env.AMADEUS_API_SECRET,
    }),
  });

  const data = await response.json();
  if (!data.access_token) throw new Error("Falha ao gerar token Amadeus");
  return data.access_token;
}

async function buscarOferta(token, origem, destino) {
  const data = proximaData();
  const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origem}&destinationLocationCode=${destino}&departureDate=${data}&adults=1&max=5&currencyCode=BRL`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await response.json();
  if (!json?.data?.length) return null;

  return {
    preco: json.data[0].price.grandTotal,
    companhia: json.data[0].validatingAirlineCodes?.[0] || "N/A",
  };
}

function montarRotas(alerta) {
  const origemLista = expandir(alerta.origem, alerta.tipo_origem);
  if (!origemLista.length) return [];

  const destinoTexto = String(alerta.destino || "").trim().toLowerCase();

  if (destinoTexto === "" || destinoTexto === "todos" || destinoTexto === "todos os destinos") {
    const saida = [];

    for (const origem of origemLista) {
      for (const [origemPadrao, destinoPadrao] of ROTAS_PADRAO) {
        const origensPadrao = expandir(origemPadrao, "estado");
        if (!origensPadrao.find((x) => x.codigo === origem.codigo)) continue;

        const destinos = expandir(destinoPadrao, "estado");

        for (const destino of destinos) {
          if (origem.codigo === destino.codigo) continue;

          saida.push({
            origemNome: origem.nome,
            origemCodigo: origem.codigo,
            destinoNome: destino.nome,
            destinoCodigo: destino.codigo,
          });
        }
      }
    }

    return saida;
  }

  const destinos = expandir(alerta.destino, alerta.tipo_destino);
  const saida = [];

  for (const origem of origemLista) {
    for (const destino of destinos) {
      if (origem.codigo === destino.codigo) continue;

      saida.push({
        origemNome: origem.nome,
        origemCodigo: origem.codigo,
        destinoNome: destino.nome,
        destinoCodigo: destino.codigo,
      });
    }
  }

  return saida;
}

function expandir(valor, tipo) {
  if (!valor) return [];

  const texto = String(valor).trim().toUpperCase();

  if (String(tipo || "").toLowerCase() === "aeroporto") {
    return [{ codigo: texto, nome: NOMES_AEROPORTOS[texto] || texto }];
  }

  const aeroportos = CIDADES[texto] || [];
  return aeroportos.map((codigo) => ({
    codigo,
    nome: nomeCidade(valor),
  }));
}

function nomeCidade(valor) {
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

function proximaData() {
  const d = new Date();
  d.setDate(d.getDate() + 45);
  return d.toISOString().slice(0, 10);
}

function mediaReferencia(origem, destino) {
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

  return medias[`${origem}-${destino}`] || 900;
}

function calcularScore(preco, media) {
  const desconto = ((media - preco) / media) * 100;

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
