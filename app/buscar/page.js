"use client";

import { useState } from "react";

const OPCOES = [
  { codigo: "GRU", nome: "São Paulo (GRU)" },
  { codigo: "CGH", nome: "São Paulo (CGH)" },
  { codigo: "VCP", nome: "São Paulo (VCP)" },
  { codigo: "GIG", nome: "Rio de Janeiro (GIG)" },
  { codigo: "SDU", nome: "Rio de Janeiro (SDU)" },
  { codigo: "MIA", nome: "Miami (MIA)" },
  { codigo: "LIS", nome: "Lisboa (LIS)" },
  { codigo: "MAD", nome: "Madri (MAD)" },
  { codigo: "CDG", nome: "Paris (CDG)" },
  { codigo: "FCO", nome: "Roma (FCO)" },
  { codigo: "SCL", nome: "Santiago (SCL)" },
  { codigo: "EZE", nome: "Buenos Aires (EZE)" },
  { codigo: "AEP", nome: "Buenos Aires (AEP)" },
  { codigo: "SSA", nome: "Salvador (SSA)" },
  { codigo: "REC", nome: "Recife (REC)" },
  { codigo: "FOR", nome: "Fortaleza (FOR)" },
  { codigo: "JPA", nome: "João Pessoa (JPA)" },
  { codigo: "FLN", nome: "Florianópolis (FLN)" },
];

function hojeMais30Dias() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function badge(nivel) {
  const mapa = {
    imperdivel: {
      texto: "Imperdível",
      bg: "#fff1f2",
      cor: "#dc2626",
      borda: "#fecdd3",
    },
    otima: {
      texto: "Ótima",
      bg: "#fff7ed",
      cor: "#b45309",
      borda: "#fed7aa",
    },
    boa: {
      texto: "Boa",
      bg: "#ecfdf5",
      cor: "#15803d",
      borda: "#bbf7d0",
    },
    regular: {
      texto: "Regular",
      bg: "#f3f4f6",
      cor: "#374151",
      borda: "#d1d5db",
    },
  };

  return mapa[nivel] || mapa.regular;
}

function formatarPreco(preco) {
  return Number(preco).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function BuscarPage() {
  const [origem, setOrigem] = useState("GRU");
  const [destino, setDestino] = useState("MIA");
  const [data, setData] = useState(hojeMais30Dias());
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [resultados, setResultados] = useState([]);

  async function buscar(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    setResultados([]);

    try {
      const params = new URLSearchParams({
        origem,
        destino,
        data,
      });

      const response = await fetch(`/api/buscar?${params.toString()}`);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Erro ao buscar promoções.");
      }

      setResultados(json.resultados || []);
    } catch (error) {
      setErro(error.message || "Erro ao buscar promoções.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #eef6ff 0%, #f8fbff 45%, #ffffff 100%)",
        padding: "32px 20px 80px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            color: "white",
            padding: 36,
            borderRadius: 32,
            marginBottom: 28,
            boxShadow: "0 20px 45px rgba(37,99,235,.22)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(36px, 7vw, 64px)",
              lineHeight: 1,
              fontWeight: 900,
            }}
          >
            Bora viajar
            <br />
            pagando menos? ✈️
          </h1>

          <p
            style={{
              marginTop: 14,
              marginBottom: 0,
              fontSize: 18,
              opacity: 0.95,
              maxWidth: 700,
            }}
          >
            Pesquise promoções manualmente e abra a busca real no Google Flights.
          </p>
        </div>

        <form
          onSubmit={buscar}
          style={{
            background: "rgba(255,255,255,.92)",
            borderRadius: 30,
            padding: 24,
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 50px rgba(15,23,42,.05)",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <CampoSelect
              label="Origem"
              value={origem}
              onChange={setOrigem}
              options={OPCOES}
            />

            <CampoSelect
              label="Destino"
              value={destino}
              onChange={setDestino}
              options={OPCOES}
            />

            <CampoData
              label="Data de ida"
              value={data}
              onChange={setData}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#10b981",
                color: "white",
                padding: "16px 28px",
                borderRadius: 999,
                border: "none",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
                opacity: loading ? 0.75 : 1,
                boxShadow: "0 10px 25px rgba(16,185,129,.18)",
              }}
            >
              {loading ? "Buscando..." : "Buscar promoções"}
            </button>

            <a
              href="/painel"
              style={{
                background: "#3b82f6",
                color: "white",
                padding: "16px 28px",
                borderRadius: 999,
                textDecoration: "none",
                fontWeight: 800,
                fontSize: 16,
                boxShadow: "0 10px 25px rgba(59,130,246,.18)",
              }}
            >
              Voltar ao painel
            </a>
          </div>

          <div
            style={{
              marginTop: 14,
              color: "#d97706",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Nesta versão, o sistema mostra preço estimado e abre a busca real no Google Flights.
          </div>
        </form>

        {erro ? (
          <div
            style={{
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#b91c1c",
              borderRadius: 22,
              padding: 18,
              marginBottom: 20,
              fontWeight: 700,
            }}
          >
            {erro}
          </div>
        ) : null}

        {resultados.length > 0 ? (
          <div style={{ display: "grid", gap: 22 }}>
            {resultados.map((item) => {
              const estilo = badge(item.nivel);

              return (
                <div
                  key={item.id}
                  style={{
                    background: "rgba(255,255,255,.92)",
                    border: "1px solid #e5e7eb",
                    borderRadius: 32,
                    padding: 28,
                    boxShadow: "0 20px 50px rgba(15,23,42,.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 20,
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "clamp(26px, 4vw, 42px)",
                          color: "#111827",
                          fontWeight: 900,
                        }}
                      >
                        {item.origem} → {item.destino}
                      </h2>

                      <div
                        style={{
                          marginTop: 10,
                          color: "#6b7280",
                          fontSize: 16,
                        }}
                      >
                        Data pesquisada: {item.data_busca}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "12px 18px",
                        borderRadius: 999,
                        background: estilo.bg,
                        color: estilo.cor,
                        border: `2px solid ${estilo.borda}`,
                        fontWeight: 800,
                        fontSize: 16,
                      }}
                    >
                      {estilo.texto}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 16,
                      marginTop: 24,
                    }}
                  >
                    <InfoCard
                      label="Preço"
                      value={formatarPreco(item.preco)}
                      destaque
                    />
                    <InfoCard label="Companhia" value={item.companhia} />
                    <InfoCard label="Score" value={String(item.score)} />
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <span
                      style={{
                        color: "#d97706",
                        fontWeight: 800,
                        fontSize: 14,
                      }}
                    >
                      ⚠ Preço estimado
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 14,
                      flexWrap: "wrap",
                      marginTop: 24,
                    }}
                  >
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: "#e9a23b",
                        color: "white",
                        padding: "16px 28px",
                        borderRadius: 999,
                        textDecoration: "none",
                        fontWeight: 800,
                        display: "inline-block",
                        boxShadow: "0 10px 25px rgba(233,162,59,.18)",
                      }}
                    >
                      Ver no Google Flights ✈️
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              background: "rgba(255,255,255,.82)",
              border: "1px dashed #d1d5db",
              borderRadius: 28,
              padding: 28,
              color: "#6b7280",
              fontSize: 18,
            }}
          >
            Faça uma busca acima para ver as promoções aparecerem aqui.
          </div>
        )}
      </div>
    </div>
  );
}

function CampoSelect({ label, value, onChange, options }) {
  return (
    <label style={{ display: "block" }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: "#374151",
          marginBottom: 8,
        }}
      >
        {label}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: 54,
          borderRadius: 16,
          border: "1px solid #d1d5db",
          padding: "0 14px",
          fontSize: 16,
          background: "white",
          outline: "none",
        }}
      >
        {options.map((item) => (
          <option key={item.codigo} value={item.codigo}>
            {item.nome}
          </option>
        ))}
      </select>
    </label>
  );
}

function CampoData({ label, value, onChange }) {
  return (
    <label style={{ display: "block" }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: "#374151",
          marginBottom: 8,
        }}
      >
        {label}
      </div>

      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: 54,
          borderRadius: 16,
          border: "1px solid #d1d5db",
          padding: "0 14px",
          fontSize: 16,
          background: "white",
          outline: "none",
        }}
      />
    </label>
  );
}

function InfoCard({ label, value, destaque = false }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 24,
        padding: 22,
      }}
    >
      <div
        style={{
          color: "#6b7280",
          fontSize: 15,
          marginBottom: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: destaque ? "#16a34a" : "#111827",
          fontSize: "clamp(24px, 4vw, 34px)",
          fontWeight: 900,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}
