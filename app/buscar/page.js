"use client";

import { useState } from "react";

export default function BuscarPage() {
  const [origem, setOrigem] = useState("GRU");
  const [destino, setDestino] = useState("MIA");

  async function buscar(e) {
    e.preventDefault();
    window.location.href = `/api/buscar?origem=${origem}&destino=${destino}`;
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "40px auto",
        padding: 20,
      }}
    >
      {/* HERO */}
      <div
        style={{
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          color: "white",
          padding: 40,
          borderRadius: 30,
          marginBottom: 30,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ fontSize: 42, margin: 0 }}>
          ✈️ Bora viajar pagando menos?
        </h1>

        <p style={{ marginTop: 10, fontSize: 18 }}>
          Descubra promoções em segundos
        </p>
      </div>

      {/* CARD */}
      <form
        onSubmit={buscar}
        style={{
          background: "white",
          padding: 30,
          borderRadius: 25,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 15,
            flexWrap: "wrap",
          }}
        >
          <input
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            placeholder="Origem (GRU)"
            style={input}
          />

          <input
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Destino (MIA)"
            style={input}
          />

          <button style={botao}>
            Buscar ✈️
          </button>
        </div>
      </form>
    </div>
  );
}

const input = {
  flex: 1,
  minWidth: 200,
  padding: 15,
  borderRadius: 12,
  border: "1px solid #ccc",
  fontSize: 16,
};

const botao = {
  background: "#10b981",
  color: "white",
  padding: "15px 25px",
  borderRadius: 12,
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};
