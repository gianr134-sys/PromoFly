"use client";

import { useState } from "react";

export default function CriarAlerta() {
  const [origemTipo, setOrigemTipo] = useState("estado");
  const [destinoTipo, setDestinoTipo] = useState("todos");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");

  async function criarAlerta() {
    const res = await fetch("/api/alertas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        origem,
        destino,
        origemTipo,
        destinoTipo
      })
    });

    if (res.ok) {
      alert("Alerta criado com sucesso ✈️");
      setOrigem("");
      setDestino("");
    } else {
      alert("Erro ao criar alerta");
    }
  }

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
            style={input}
            placeholder="Ex: São Paulo, GRU..."
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            list="origens"
          />

          <datalist id="origens">
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


        {/* DESTINO */}

        <div style={card}>

          <h3>🌎 Para onde você quer ir?</h3>

          <div style={destinoGroup}>

            <button
              style={destinoTipo === "todos" ? activeBtnYellow : btn}
              onClick={() => setDestinoTipo("todos")}
            >
              🏝️ Todos os destinos
            </button>

            <button
              style={destinoTipo === "escolher" ? activeBtn : btn}
              onClick={() => setDestinoTipo("escolher")}
            >
              🎯 Escolher destino
            </button>

            <button
              style={destinoTipo === "surpresa" ? activeBtn : btn}
              onClick={() => setDestinoTipo("surpresa")}
            >
              🎲 Me surpreenda
            </button>

          </div>

          {destinoTipo === "escolher" && (

            <input
              style={input}
              placeholder="Ex: João Pessoa, Lisboa..."
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              list="destinos"
            />

          )}

          <datalist id="destinos">
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

        </div>


        <button style={continueBtn} onClick={criarAlerta}>
          Continuar 🚀
        </button>

      </div>
    </div>
  );
}


/* ESTILOS */

const page = {
  minHeight: "100vh",
  background: "#dff0fb",
  padding: "40px 20px"
};

const container = {
  maxWidth: "700px",
  margin: "0 auto"
};

const title = {
  fontSize: "32px",
  fontWeight: "800",
  marginBottom: "10px"
};

const subtitle = {
  marginBottom: "30px",
  fontSize: "18px"
};

const card = {
  background: "#fff",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "25px"
};

const toggleGroup = {
  display: "flex",
  gap: "10px",
  margin: "20px 0"
};

const destinoGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  margin: "20px 0"
};

const btn = {
  padding: "15px",
  borderRadius: "15px",
  border: "1px solid #ccc",
  background: "#f5f5f5",
  cursor: "pointer"
};

const activeBtn = {
  ...btn,
  background: "#69b35a",
  color: "#fff"
};

const activeBtnYellow = {
  ...btn,
  background: "#f3cf4c",
  color: "#2d5ea8"
};

const input = {
  width: "100%",
  padding: "18px",
  borderRadius: "15px",
  border: "1px solid #ccc",
  fontSize: "16px"
};

const continueBtn = {
  width: "100%",
  padding: "22px",
  borderRadius: "40px",
  background: "#f29d32",
  border: "none",
  fontSize: "20px",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer"
};
