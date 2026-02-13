"use client";

import { useState } from "react";

export default function CriarAlerta() {
  const [origemTipo, setOrigemTipo] = useState("estado");
  const [destinoTipo, setDestinoTipo] = useState("todos");

  return (
    <div style={page}>
      <div style={container}>
        
        <h1 style={title}>Criar alerta de promoção ✈️</h1>
        <p style={subtitle}>
          Escolha de onde quer sair e para onde quer receber promoções.
        </p>

        {/* ORIGEM */}
        <div style={card}>
          <h3>📍 De onde você sai?</h3>

          <div style={toggleGroup}>
            <button
              style={origemTipo === "estado" ? activeBtn : btn}
              onClick={() => setOrigemTipo("estado")}
            >
              🌿 Estado
            </button>

            <button
              style={origemTipo === "aeroporto" ? activeBtn : btn}
              onClick={() => setOrigemTipo("aeroporto")}
            >
              ✈️ Aeroporto
            </button>
          </div>

          <input
            placeholder="Ex: São Paulo, GRU..."
            style={input}
          />
        </div>

        {/* DESTINO */}
        <div style={card}>
          <h3>🌎 Para onde você quer ir?</h3>

          <button
            style={destinoTipo === "todos" ? activeSelect : select}
            onClick={() => setDestinoTipo("todos")}
          >
            🏝️ Todos os destinos
          </button>

          <button
            style={destinoTipo === "escolher" ? activeSelect : select}
            onClick={() => setDestinoTipo("escolher")}
          >
            🎯 Escolher destino
          </button>

          <button
            style={destinoTipo === "surpresa" ? activeSelect : select}
            onClick={() => setDestinoTipo("surpresa")}
          >
            🎲 Me surpreenda
          </button>
        </div>

        {/* BOTÃO */}
        <button style={mainButton}>
          Continuar 🚀
        </button>

      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "linear-gradient(to bottom, #b3e5fc, #ffffff)",
  display: "flex",
  justifyContent: "center",
  padding: 20
};

const container = {
  width: "100%",
  maxWidth: 420,
};

const title = {
  fontSize: 28,
  fontWeight: "bold",
  marginBottom: 5
};

const subtitle = {
  color: "#555",
  marginBottom: 20
};

const card = {
  background: "white",
  borderRadius: 20,
  padding: 20,
  marginBottom: 20,
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
};

const toggleGroup = {
  display: "flex",
  gap: 10,
  marginBottom: 15
};

const btn = {
  flex: 1,
  padding: 10,
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#f5f5f5",
  cursor: "pointer"
};

const activeBtn = {
  ...btn,
  background: "#4caf50",
  color: "white",
  border: "none"
};

const select = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#f5f5f5",
  marginBottom: 10,
  cursor: "pointer"
};

const activeSelect = {
  ...select,
  background: "#ffcc00",
  border: "none",
  fontWeight: "bold"
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ddd"
};

const mainButton = {
  width: "100%",
  padding: 15,
  borderRadius: 20,
  border: "none",
  background: "#ff9800",
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
  cursor: "pointer"
};
