"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function PainelPage() {
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    carregarPainel();
  }, []);

  async function carregarPainel() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUsuario(user);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      alert(error.message);
    } else {
      setPerfil(data);
    }

    setLoading(false);
  }

  async function sair() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return <div style={page}>Carregando painel...</div>;
  }

  return (
    <div style={page}>
      <div style={container}>
        <h1 style={title}>Painel do PromoFly ✈️</h1>
        <p style={subtitle}>Bem-vindo ao seu painel de alertas promocionais.</p>

        <div style={card}>
          <p><strong>Nome:</strong> {perfil?.nome || "Usuário"}</p>
          <p><strong>Email:</strong> {perfil?.email || usuario?.email}</p>
        </div>

        <div style={actions}>
          <a href="/alerta" style={primaryBtn}>Criar novo alerta</a>
          <a href="/alertas" style={secondaryBtn}>Meus alertas</a>
          <button onClick={sair} style={logoutBtn}>Sair</button>
        </div>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#eaf7ff",
  padding: "40px 20px",
  fontFamily: "Arial, sans-serif",
};

const container = {
  maxWidth: "760px",
  margin: "0 auto",
};

const title = {
  fontSize: "36px",
  fontWeight: "800",
  marginBottom: "10px",
};

const subtitle = {
  fontSize: "18px",
  color: "#555",
  marginBottom: "24px",
};

const card = {
  background: "#fff",
  borderRadius: "22px",
  padding: "24px",
  marginBottom: "24px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const actions = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const primaryBtn = {
  textDecoration: "none",
  background: "#f29d32",
  color: "#fff",
  padding: "14px 22px",
  borderRadius: "999px",
  fontWeight: "800",
};

const secondaryBtn = {
  textDecoration: "none",
  background: "#3478f6",
  color: "#fff",
  padding: "14px 22px",
  borderRadius: "999px",
  fontWeight: "800",
};

const logoutBtn = {
  background: "#111",
  color: "#fff",
  padding: "14px 22px",
  borderRadius: "999px",
  border: "none",
  fontWeight: "800",
  cursor: "pointer",
};
