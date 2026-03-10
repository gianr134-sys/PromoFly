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
    const { data, error } = await supabase
      .from("oportunidades")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setDados(data || []);
    setLoading(false);
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Carregando promoções...</div>;
  }

  return (
    <div style={page}>
      <div style={container}>
        <h1 style={title}>Promoções encontradas ✈️</h1>

        <div style={topButtons}>
          <a href="/painel" style={btnVoltar}>
            Voltar ao painel
          </a>

          <a href="/alerta" style={btnCriar}>
            Criar novo alerta
          </a>
        </div>

        {dados.length === 0 && (
          <div style={card}>Nenhuma promoção encontrada ainda</div>
        )}

        {dados.map((item) => (
          <div key={item.id} style={card}>
            <p>
              <b>Origem:</b> {item.origem}
            </p>

            <p>
              <b>Destino:</b> {item.destino}
            </p>

            <p>
              <b>Preço:</b> R$ {item.preco}
            </p>

            <p>
              <b>Companhia:</b> {item.companhia}
            </p>

            <p>
              <b>Score:</b> {item.score}
            </p>

            <p>
              <b>Nível:</b> {item.nivel}
            </p>

            <a href={item.link} target="_blank" rel="noreferrer" style={btn}>
              Ver promoção
            </a>
          </div>
        ))}
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
  maxWidth: "700px",
  margin: "0 auto",
};

const title = {
  fontSize: "32px",
  fontWeight: "800",
  marginBottom: "20px",
};

const topButtons = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const btnVoltar = {
  background: "#3478f6",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: "700",
};

const btnCriar = {
  background: "#f29d32",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: "700",
};

const card = {
  background: "#fff",
  borderRadius: "20px",
  padding: "20px",
  marginBottom: "15px",
};

const btn = {
  display: "inline-block",
  marginTop: "10px",
  background: "#f29d32",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: "700",
};
