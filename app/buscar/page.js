"use client";

import { useState } from "react";

export default function BuscarPage() {
  const [origem, setOrigem] = useState("GRU");
  const [destino, setDestino] = useState("MIA");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  async function buscar() {
    setLoading(true);
    setResultado(null);

    try {
      const res = await fetch("/api/buscar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origem,
          destino,
        }),
      });

      const data = await res.json();
      setResultado(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Buscar voo ✈️</h1>

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Origem (ex: GRU)"
          value={origem}
          onChange={(e) => setOrigem(e.target.value)}
        />

        <input
          placeholder="Destino (ex: MIA)"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          style={{ marginLeft: 10 }}
        />

        <button onClick={buscar} style={{ marginLeft: 10 }}>
          Buscar
        </button>
      </div>

      {loading && <p>Buscando...</p>}

      {resultado && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(resultado, null, 2)}
        </pre>
      )}
    </div>
  );
}
