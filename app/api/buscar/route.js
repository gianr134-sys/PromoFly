import { NextResponse } from "next/server";

const AEROPORTOS = {
  GRU: { cidade: "São Paulo", nome: "Guarulhos" },
  CGH: { cidade: "São Paulo", nome: "Congonhas" },
  VCP: { cidade: "São Paulo", nome: "Viracopos" },
  GIG: { cidade: "Rio de Janeiro", nome: "Galeão" },
  SDU: { cidade: "Rio de Janeiro", nome: "Santos Dumont" },
  MIA: { cidade: "Miami", nome: "Miami International" },
  LIS: { cidade: "Lisboa", nome: "Lisbon" },
  MAD: { cidade: "Madri", nome: "Madrid Barajas" },
  CDG: { cidade: "Paris", nome: "Charles de Gaulle" },
  FCO: { cidade: "Roma", nome: "Fiumicino" },
  SCL: { cidade: "Santiago", nome: "Arturo Merino Benítez" },
  EZE: { cidade: "Buenos Aires", nome: "Ezeiza" },
  AEP: { cidade: "Buenos Aires", nome: "Aeroparque" },
  SSA: { cidade: "Salvador", nome: "Deputado Luís Eduardo Magalhães" },
  REC: { cidade: "Recife", nome: "Guararapes" },
  FOR: { cidade: "Fortaleza", nome: "Pinto Martins" },
  JPA: { cidade: "João Pessoa", nome: "Castro Pinto" },
  FLN: { cidade: "Florianópolis", nome: "Hercílio Luz" },
};

const COMPANHIAS = [
  "LATAM Airlines",
  "Gol Linhas Aéreas",
  "Azul Linhas Aéreas",
  "TAP Air Portugal",
  "Air Europa",
  "Iberia",
  "American Airlines",
  "Avianca",
];

function formatarNomeAeroporto(codigo) {
  const item = AEROPORTOS[codigo];
  if (!item) return codigo;
  return `${item.cidade} (${codigo})`;
}

function gerarLinkGoogleFlights(origem, destino, data) {
  return `https://www.google.com/travel/flights?q=Flights%20from%20${origem}%20to%20${destino}%20on%20${data}`;
}

function gerarPrecoEstimado(origem, destino) {
  const base = {
    "GRU-MIA": 2890,
    "GRU-LIS": 3290,
    "GRU-MAD": 3190,
    "GRU-CDG": 3890,
    "GRU-FCO": 3490,
    "GRU-SCL": 1490,
    "GRU-EZE": 1290,
    "GRU-AEP": 1190,
    "GRU-SSA": 690,
    "GRU-REC": 790,
    "GRU-FOR": 840,
    "GRU-JPA": 890,
    "GRU-FLN": 590,
    "CGH-SSA": 720,
    "CGH-REC": 820,
    "CGH-FOR": 870,
    "VCP-MIA": 2790,
    "VCP-LIS": 3090,
    "VCP-MAD": 2990,
  };

  const chave = `${origem}-${destino}`;
  const valorBase = base[chave] || 1490;

  const variacao = Math.floor(Math.random() * 400) - 200;
  return Number((valorBase + variacao).toFixed(2));
}

function gerarScore(preco) {
  if (preco <= 700) return { score: 95, nivel: "imperdivel" };
  if (preco <= 1200) return { score: 85, nivel: "otima" };
  if (preco <= 2000) return { score: 70, nivel: "boa" };
  return { score: 55, nivel: "regular" };
}

function escolherCompanhia(destino) {
  if (["LIS", "MAD", "CDG", "FCO"].includes(destino)) {
    return ["LATAM Airlines", "TAP Air Portugal", "Iberia", "Air Europa"][
      Math.floor(Math.random() * 4)
    ];
  }

  if (["MIA"].includes(destino)) {
    return ["LATAM Airlines", "American Airlines", "Avianca"][
      Math.floor(Math.random() * 3)
    ];
  }

  return COMPANHIAS[Math.floor(Math.random() * COMPANHIAS.length)];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const origem = String(searchParams.get("origem") || "").trim().toUpperCase();
    const destino = String(searchParams.get("destino") || "").trim().toUpperCase();
    const data = String(searchParams.get("data") || "").trim();

    if (!origem || !destino || !data) {
      return NextResponse.json(
        { error: "Informe origem, destino e data." },
        { status: 400 }
      );
    }

    if (origem === destino) {
      return NextResponse.json(
        { error: "Origem e destino não podem ser iguais." },
        { status: 400 }
      );
    }

    const preco = gerarPrecoEstimado(origem, destino);
    const { score, nivel } = gerarScore(preco);
    const companhia = escolherCompanhia(destino);

    const resultado = {
      id: crypto.randomUUID(),
      origem: formatarNomeAeroporto(origem),
      destino: formatarNomeAeroporto(destino),
      preco,
      companhia,
      score,
      nivel,
      tipo_preco: "estimado",
      data_busca: data,
      link: gerarLinkGoogleFlights(origem, destino, data),
    };

    return NextResponse.json({
      ok: true,
      resultados: [resultado],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Erro ao buscar promoções." },
      { status: 500 }
    );
  }
}
