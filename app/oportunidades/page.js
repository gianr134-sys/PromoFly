"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function OportunidadesPage() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        alert(userError.message);
        setLoading(false);
        return;
      }

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("oportunidades")
        .select("*")
        .eq("user_id", user.id)
        .order("criado_em", { ascending: false });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      setDados(data || []);
      setLoading(false);
    } catch (err) {
      alert(err?.message || "Erro ao carregar promoções.");
      setLoading(false);
    }
  }

  async function excluirOportunidade(id) {
    const confirmar = window.confirm("Deseja excluir esta oportunidade?");
    if (!confirmar) return;

    const { error } = await supabase.from("oportunidades").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setDados((atual) => atual.filter((item) => item.id !== id));
  }

  function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getNivelStyle(nivel) {
    const valor = (nivel || "").toLowerCase();

    if (valor === "imperdivel" || valor === "imperdível") {
      return {
        background: "#ffe7e7",
        color: "#d62828",
        border: "1px solid #ffb3b3",
      };
    }

    if (valor === "otima" || valor === "ótima") {
      return {
        background: "#fff4d6",
        color: "#b7791f",
        border: "1px solid #f6d37a",
      };
    }

    if (valor === "boa") {
      return {
        background: "#e3f7e8",
        color: "#2f855a",
        border: "1px solid #9ae6b4",
      };
    }

    return {
      background: "#edf2f7",
      color: "#4a5568",
      border: "1px solid #cbd5e0",
    };
  }

  if (loading) {
    return <div style={{ padding: 40, fontFamily: "Arial" }}>Carregando promoções...</div>;
  }

  return (
    <div style={page}>
      <div style={container}>
        <h1 style={title}>Promoções encontradas ✈️</h1>
        <p style={subtitle}>
          Aqui estão as oportunidades encontradas pelo robô do PromoFly.
        </p>

        <div style={topButtons}>
          <a href="/painel" style={btnVoltar}>
            Voltar ao painel
          </a>

          <a href="/alerta" style={btnCriar}>
            Criar novo alerta
          </a>
        </div>

        {dados.length === 0 && (
          <div style={emptyCard}>Nenhuma promoção encontrada ainda.</div>
        )}

        {dados.map((item) => (
          <div key={item.id} style={card}>
            <div style={cardTop}>
              <div>
                <div style={rota}>
                  {item.origem} → {item.destino}
                </div>
                <div style={dataText}>Encontrada em {formatarData(item.criado_em)}</div>
              </div>

              <span style={{ ...badgeBase, ...getNivelStyle(item.nivel) }}>
                {item.nivel || "normal"}
              </span>
            </div>

            <div style={infoGrid}>
              <div style={infoBox}>
                <span style={label}>Preço</span>
                <span style={valuePrice}>R$ {item.preco}</span>
              </div>

              <div style={infoBox}>
                <span style={label}>Companhia</span>
                <span style={value}>{item.companhia || "-"}</span>
              </div>

              <div style={infoBox}>
                <span style={label}>Score</span>
                <span style={value}>{item.score ?? "-"}</span>
              </div>
            </div>

            <div style={actions}>
              <a href={item.link} target="_blank" rel="noreferrer" style={btnPromo}>
                Ver promoção
              </a>

              <button
                type="button"
                style={btnExcluir}
                onClick={() => excluirOportunidade(item.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #eaf7ff 0%, #f8fcff 100%)",
  padding: "40px 20px",
  fontFamily: "Arial, sans-serif",
};

const container = {
  maxWidth: "820px",
  margin: "0 auto",
};

const title = {
  fontSize: "42px",
  fontWeight: "800",
  marginBottom: "10px",
  color: "#1f2937",
};

const subtitle = {
  fontSize: "18px",
  color: "#667085",
  marginBottom: "24px",
};

const topButtons = {
  display: "flex",
  gap: "12px",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const btnVoltar = {
  background: "#3478f6",
  color: "#fff",
  padding: "14px 22px",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: "700",
  boxShadow: "0 8px 20px rgba(52, 120, 246, 0.18)",
};

const btnCriar = {
  background: "#f29d32",
  color: "#fff",
  padding: "14px 22px",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: "700",
  boxShadow: "0 8px 20px rgba(242, 157, 50, 0.18)",
};

const emptyCard = {
  background: "#fff",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  color: "#555",
};

const card = {
  background: "#fff",
  borderRadius: "24px",
  padding: "24px",
  marginBottom: "18px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  border: "1px solid #edf2f7",
};

const cardTop = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
  marginBottom: "18px",
  flexWrap: "wrap",
};

const rota = {
  fontSize: "26px",
  fontWeight: "800",
  color: "#1f2937",
  marginBottom: "6px",
};

const dataText = {
  fontSize: "14px",
  color: "#718096",
};

const badgeBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 14px",
  borderRadius: "999px",
  fontSize: "14px",
  fontWeight: "800",
  textTransform: "capitalize",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "12px",
  marginBottom: "18px",
};

const infoBox = {
  background: "#f8fbff",
  borderRadius: "18px",
  padding: "16px",
  border: "1px solid #e6eef7",
};

const label = {
  display: "block",
  fontSize: "13px",
  color: "#718096",
  marginBottom: "6px",
};

const value = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1f2937",
};

const valuePrice = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#16a34a",
};

const actions = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const btnPromo = {
  display: "inline-block",
  background: "#f29d32",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: "700",
};

const btnExcluir = {
  background: "#fff5f5",
  color: "#e53e3e",
  border: "1px solid #feb2b2",
  padding: "12px 18px",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: "700",
};
