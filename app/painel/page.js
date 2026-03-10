"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function PainelPage() {
  const [usuario, setUsuario] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUsuario(user);

    const { data } = await supabase
      .from("alertas")
      .select("*")
      .eq("user_id", user.id);

    setAlertas(data || []);
    setLoading(false);
  }

  async function sair() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Carregando painel...</div>;
  }

  return (
    <div style={page}>
      <div style={container}>
        <h1 style={title}>Painel PromoFly ✈️</h1>

        <p style={subtitle}>
          Bem-vindo! Aqui você gerencia seus alertas de passagens.
        </p>

        <div style={cards}>
          <div style={card}>
            <div style={cardTitle}>Alertas ativos</div>
            <div style={cardValue}>{alertas.length}</div>
          </div>

          <div style={card}>
            <div style={cardTitle}>Promoções encontradas</div>
            <div style={cardValue}>Auto</div>
          </div>

          <div style={card}>
            <div style={cardTitle}>Conta</div>
            <div style={cardValue}>Free</div>
          </div>
        </div>

        <div style={buttons}>
          <a href="/alerta" style={btnCriar}>
            Criar novo alerta
          </a>

          <a href="/alertas" style={btnAzul}>
            Ver meus alertas
          </a>

          <a href="/oportunidades" style={btnLaranja}>
            Ver promoções
          </a>
        </div>

        <button onClick={sair} style={btnSair}>
          Sair
        </button>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#eef8ff",
  padding: "40px 20px",
  fontFamily: "Arial",
};

const container = {
  maxWidth: "800px",
  margin: "0 auto",
};

const title = {
  fontSize: "36px",
  fontWeight: "800",
  marginBottom: "10px",
};

const subtitle = {
  fontSize: "18px",
  color: "#666",
  marginBottom: "30px",
};

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const card = {
  background: "#fff",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const cardTitle = {
  fontSize: "16px",
  color: "#666",
};

const cardValue = {
  fontSize: "28px",
  fontWeight: "800",
};

const buttons = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  marginBottom: "20px",
};

const btnCriar = {
  background: "#f29d32",
  color: "#fff",
  padding: "14px 20px",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: "700",
};

const btnAzul = {
  background: "#3478f6",
  color: "#fff",
  padding: "14px 20px",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: "700",
};

const btnLaranja = {
  background: "#ff7a00",
  color: "#fff",
  padding: "14px 20px",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: "700",
};

const btnSair = {
  background: "#eee",
  border: "none",
  padding: "12px 18px",
  borderRadius: "999px",
  cursor: "pointer",
};
