"use client";

import { useState } from "react";

export default function CriarAlerta() {
  const [origemTipo, setOrigemTipo] = useState("estado");
  const [destinoTipo, setDestinoTipo] = useState("todos");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [loading, setLoading] = useState(false);

  async function criarAlerta() {
    try {
      setLoading(true);

      const res = await fetch("/api/alertas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origem,
          destino,
          origemTipo,
          destinoTipo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Erro ao criar alerta: " + (data.error || "Erro desconhecido"));
        return;
      }

      alert("Alerta criado com sucesso ✈️");
      setOrigem("");
      setDestino("");
      setOrigemTipo("estado");
      setDestinoTipo("todos");
    } catch (error) {
      alert("Erro ao criar alerta: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={container}>
        <h1 style={title}>Criar alerta de promoção ✈️</h1>

        <p style={subtitle}>
          Escolha de onde quer sair e para onde quer receber promoções.
        </p>

        <div style={card}>
          <h3 style={sectionTitle}>📍 De onde você sai?</h3>

          <div style={toggleGroup}>
            <button
              type="button"
              style={origemTipo === "estado" ? activeBtnGreen : btn}
              onClick={() => setOrigemTipo("estado")}
            >
              🌿 Estado
            </button>

            <button
              type="button"
              style={origemTipo === "aeroporto" ? activeBtnBlue : btn}
              onClick={() => setOrigemTipo("aeroporto")}
            >
              ✈️ Aeroporto
            </button>
          </div>

          <input
            style={input}
            placeholder="Ex: São Paulo, GRU..."
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            list="origens-list"
          />

          <datalist id="origens-list">
            <option value="São Paulo" />
            <option value="Rio de Janeiro" />
            <option value="Minas Gerais" />
            <option value="Bahia" />
            <option value="Paraná" />
            <option value="Santa Catarina" />
            <option value="Rio Grande do Sul" />
            <option value="Brasília" />
            <option value="GRU" />
            <option value="CGH" />
            <option value="VCP" />
            <option value="SDU" />
            <option value="GIG" />
            <option value="BSB" />
            <option value="CNF" />
            <option value="SSA" />
            <option value="REC" />
            <option value="FOR" />
          </datalist>
        </div>

        <div style={card}>
          <h3 style={sectionTitle}>🌎 Para onde você quer ir?</h3>

          <div style={verticalOptions}>
            <button
              type="button"
              style={destinoTipo === "todos" ? activeBtnYellow : btn}
              onClick={() => setDestinoTipo("todos")}
            >
              🏝️ Todos os destinos
            </button>

            <button
              type="button"
              style={destinoTipo === "escolher" ? activeBtnBlue : btn}
              onClick={() => setDestinoTipo("escolher")}
            >
              🎯 Escolher destino
            </button>

            <button
              type="button"
              style={destinoTipo === "surpresa" ? activeBtnBlue : btn}
              onClick={() => setDestinoTipo("surpresa")}
            >
              🎲 Me surpreenda
            </button>
          </div>

          {destinoTipo === "escolher" && (
            <>
              <input
                style={input}
                placeholder="Ex: João Pessoa, Lisboa, Salvador..."
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                list="destinos-list"
              />

              <datalist id="destinos-list">
                <option value="João Pessoa" />
                <option value="Salvador" />
                <option value="Recife" />
                <option value="Fortaleza" />
                <option value="Lisboa" />
                <option value="Maceió" />
                <option value="Natal" />
                <option value="Gramado" />
                <option value="Buenos Aires" />
                <option value="Santiago" />
              </datalist>
            </>
          )}
        </div>

        <button
          type="button"
          style={continueBtn}
          onClick={criarAlerta}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Continuar 🚀"}
        </button>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#dff0fb",
  padding: "40px 20px",
  fontFamily: "Arial, sans-serif",
};

const container = {
  maxWidth: "760px",
  margin: "0 auto",
};

const title = {
  fontSize: "32px",
  fontWeight: "800",
  marginBottom: "12px",
};

const subtitle = {
  fontSize: "18px",
  color: "#555",
  marginBottom: "28px",
};

const card = {
  background: "#fff",
  borderRadius: "28px",
  padding: "26px",
  marginBottom: "26px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const sectionTitle = {
  fontSize: "20px",
  marginBottom: "18px",
};

const toggleGroup = {
  display: "flex",
  gap: "14px",
  margin: "18px 0",
};

const verticalOptions = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  marginTop: "18px",
  marginBottom: "18px",
};

const btn = {
  flex: 1,
  padding: "18px 20px",
  borderRadius: "18px",
  border: "2px solid #ddd",
  background: "#f8f8f8",
  fontSize: "16px",
  cursor: "pointer",
};

const activeBtnGreen = {
  ...btn,
  background: "#69b35a",
  color: "#fff",
  border: "2px solid #69b35a",
  fontWeight: "700",
};

const activeBtnBlue = {
  ...btn,
  background: "#eef5ff",
  color: "#3478f6",
  border: "2px solid #3478f6",
  fontWeight: "700",
};

const activeBtnYellow = {
  ...btn,
  background: "#f2cf46",
  color: "#2d5ea8",
  border: "2px solid #f2cf46",
  fontWeight: "700",
};

const input = {
  width: "100%",
  padding: "20px",
  borderRadius: "18px",
  border: "2px solid #ddd",
  fontSize: "18px",
  boxSizing: "border-box",
};

const continueBtn = {
  width: "100%",
  padding: "24px",
  borderRadius: "999px",
  border: "none",
  background: "#f29d32",
  color: "#fff",
  fontSize: "22px",
  fontWeight: "800",
  cursor: "pointer",
};
