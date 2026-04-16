"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function OportunidadesPage() {
  const [oportunidades, setOportunidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      setLoading(false);
      alert("Faça login novamente.");
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("oportunidades")
      .select("*")
      .eq("user_id", session.user.id)
      .order("criado_em", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setOportunidades(data || []);
    setLoading(false);
  }

  async function excluir(id) {
    const confirmar = confirm("Deseja excluir esta promoção?");
    if (!confirmar) return;

    const { error } = await supabase.from("oportunidades").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    carregar();
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
      normal: {
        texto: "Normal",
        bg: "#f3f4f6",
        cor: "#374151",
        borda: "#d1d5db",
      },
    };

    return mapa[nivel] || mapa.normal;
  }

  function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR");
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
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: "clamp(42px, 7vw, 72px)",
              lineHeight: 1,
              margin: 0,
              color: "#111827",
              fontWeight: 900,
            }}
          >
            Promoções
            <br />
            encontradas ✈️
          </h1>

          <p
            style={{
              marginTop: 18,
              fontSize: 18,
              color: "#6b7280",
              maxWidth: 720,
            }}
          >
            Aqui estão as oportunidades encontradas pelo robô do PromoFly.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <a
            href="/painel"
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "16px 28px",
              borderRadius: 999,
              textDecoration: "none",
              fontWeight: 800,
              boxShadow: "0 10px 25px rgba(59,130,246,.18)",
            }}
          >
            Voltar ao painel
          </a>

          <a
            href="/alerta"
            style={{
              background: "#e9a23b",
              color: "white",
              padding: "16px 28px",
              borderRadius: 999,
              textDecoration: "none",
              fontWeight: 800,
              boxShadow: "0 10px 25px rgba(233,162,59,.18)",
            }}
          >
            Criar novo alerta
          </a>
        </div>

        {loading ? (
          <div
            style={{
              background: "white",
              borderRadius: 28,
              padding: 28,
              border: "1px solid #e5e7eb",
            }}
          >
            Carregando promoções...
          </div>
        ) : oportunidades.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: 28,
              padding: 28,
              border: "1px solid #e5e7eb",
              color: "#6b7280",
              fontSize: 18,
            }}
          >
            Nenhuma promoção encontrada ainda.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 22,
            }}
          >
            {oportunidades.map((item) => {
              const estilo = badge(item.nivel);

              return (
                <div
                  key={item.id}
                  style={{
                    background: "rgba(255,255,255,.92)",
                    backdropFilter: "blur(10px)",
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
                        Encontrada em {formatarData(item.criado_em)}
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

                  <div
                    style={{
                      display: "flex",
                      gap: 14,
                      flexWrap: "wrap",
                      marginTop: 24,
                    }}
                  >
                    <a
                      href={item.link || "https://www.google.com/travel/flights"}
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
                      }}
                    >
                      Ver promoção ✈️
                    </a>

                    <button
                      onClick={() => excluir(item.id)}
                      style={{
                        background: "#fff",
                        color: "#dc2626",
                        border: "2px solid #fecaca",
                        padding: "16px 28px",
                        borderRadius: 999,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
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
