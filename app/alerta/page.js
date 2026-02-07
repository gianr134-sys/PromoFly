"use client";

import { useState } from "react";

export default function CriarAlerta() {
  const [destinoModo, setDestinoModo] = useState("escolher");
  const [modoViagem, setModoViagem] = useState("flexivel");

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 8 }}>Criar alerta ✈️🔥</h1>
        <p style={{ color: "#555", marginBottom: 24 }}>
          A gente te avisa só quando aparecer uma promoção espetacular.
        </p>

        {/* Origem */}
        <div style={card}>
          <label style={label}>📍 De onde você sai?</label>
          <input placeholder="Ex: São Paulo ou GRU" style={input} />
        </div>

        {/* Destino */}
        <div style={card}>
          <label style={label}>🎯 Para onde?</label>

          <div style={radioGroup}>
            <label>
              <input type="radio" checked={destinoModo === "escolher"} onChange={() => setDestinoModo("escolher")} /> Escolher destino
            </label>
            <label>
              <input type="radio" checked={destinoModo === "todos"} onChange={() => setDestinoModo("todos")} /> Todos os destinos
            </label>
            <label>
              <input type="radio" checked={destinoModo === "surpresa"} onChange={() => setDestinoModo("surpresa")} /> 🎲 Me surpreenda
            </label>
          </div>
        </div>

        {/* Quando */}
        <div style={card}>
          <label style={label}>🗓 Quando você quer viajar?</label>

          <div style={radioGroup}>
            <label>
              <input type="radio" checked={modoViagem === "flexivel"} onChange={() => setModoViagem("flexivel")} /> Flexível
            </label>
            <label>
              <input type="radio" checked={modoViagem === "fds"} onChange={() => setModoViagem("fds")} /> Final de semana
            </label>
            <label>
              <input type="radio" checked={modoViagem === "feriado"} onChange={() => setModoViagem("feriado")} /> Feriado
            </label>
          </div>
        </div>

        {/* Regra */}
        <div style={{ ...card, background: "#eef2ff", borderColor: "#c7d2fe" }}>
          <strong>🔥 Critério</strong>
          <p style={{ marginTop: 6, fontSize: 14 }}>
            Você será avisado apenas quando o preço estiver <b>35% ou mais abaixo da média</b>.
          </p>
        </div>

        <button style={button}>
          Criar alerta
        </button>
      </div>
    </main>
  );
}

const card = {
  background: "#fff",
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  border: "1px solid #e5e7eb"
};

const label = {
  display: "block",
  marginBottom: 8,
  fontWeight: 600
};

const input = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #d1d5db"
};

const radioGroup = {
  display: "flex",
  flexDirection: "column",
  gap: 8
};

const button = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontSize: 16,
  fontWeight: 600,
  marginTop: 12
};
