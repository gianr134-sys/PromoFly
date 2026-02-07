"use client";

import { useState } from "react";

export default function CriarAlerta() {
  const [destino, setDestino] = useState("escolher");
  const [quando, setQuando] = useState("flexivel");

  return (
    <main style={page}>
      <div style={container}>
        <h1 style={title}>Criar alerta ✈️🔥</h1>
        <p style={subtitle}>
          A gente te avisa só quando aparecer uma <b>promoção espetacular</b>.
        </p>

        <div style={card}>
          <label style={label}>📍 De onde você sai?</label>
          <input placeholder="Ex: São Paulo ou GRU" style={input} />
        </div>

        <div style={card}>
          <label style={label}>🎯 Para onde?</label>

          <Option checked={destino === "escolher"} onClick={() => setDestino("escolher")} text="Escolher destino" />
          <Option checked={destino === "todos"} onClick={() => setDestino("todos")} text="Todos os destinos" />
          <Option checked={destino === "surpresa"} onClick={() => setDestino("surpresa")} text="🎲 Me surpreenda" />
        </div>

        <div style={card}>
          <label style={label}>🗓 Quando você quer viajar?</label>

          <Option checked={quando === "flexivel"} onClick={() => setQuando("flexivel")} text="Flexível" />
          <Option checked={quando === "fds"} onClick={() => setQuando("fds")} text="Final de semana" />
          <Option checked={quando === "feriado"} onClick={() => setQuando("feriado")} text="Feriado" />
        </div>

        <div style={highlight}>
          🔥 Você será avisado apenas quando o preço estiver <b>35% ou mais abaixo da média</b>.
        </div>

        <button style={button}>Criar alerta</button>
      </div>
    </main>
  );
}

function Option({ checked, onClick, text }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...option,
        borderColor: checked ? "#2563eb" : "#e5e7eb",
        background: checked ? "#eff6ff" : "#fff",
      }}
    >
      {text}
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f8fafc, #eef2ff)",
  padding: 24,
  fontFamily: "system-ui",
};

const container = { maxWidth: 420, margin: "0 auto" };

const title = { fontSize: 28, marginBottom: 8 };

const subtitle = { color: "#555", marginBottom: 24 };

const card = {
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
};

const label = { display: "block", fontWeight: 600, marginBottom: 10 };

const input = { width: "100%", padding: 12, borderRadius: 10, border: "1px solid #d1d5db" };

const option = {
  padding: 12,
  borderRadius: 12,
  border: "2px solid",
  marginBottom: 10,
  cursor: "pointer",
  fontWeight: 600,
};

const highlight = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: 14,
  padding: 14,
  marginBottom: 20,
};

const button = {
  width: "100%",
  padding: 16,
  borderRadius: 16,
  border: "none",
  background: "linear-gradient(90deg, #2563eb, #4f46e5)",
  color: "#fff",
  fontSize: 17,
  fontWeight: 800,
};
