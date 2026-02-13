"use client";

import { useState } from "react";

export default function CriarAlerta() {
  const [destino, setDestino] = useState("escolher");
  const [quando, setQuando] = useState("flexivel");

  return (
    <>
      <div className="pf-bg">
        <span className="blob blob1" />
        <span className="blob blob2" />
        <span className="blob blob3" />
        <span className="spark s1">✨</span>
        <span className="spark s2">💸</span>
        <span className="spark s3">🧳</span>
        <span className="spark s4">🪄</span>
      </div>

      <div className="container">
        <h1>🔥 Criar alerta</h1>
        <p>
          Você não pesquisa. Você cria o alerta e o <b>PromoFly</b> caça o preço
          <b> espetacular</b> pra você.
        </p>

        <div className="card">
          <label>📍 De onde você sai?</label>
          <input placeholder="Ex: São Paulo, GRU, Recife..." />
        </div>

        <div className="card">
          <label>🎯 Para onde?</label>
          <div className="options">
            <button
              className={destino === "escolher" ? "active" : ""}
              onClick={() => setDestino("escolher")}
            >
              Escolher destino
            </button>

            <button
              className={destino === "todos" ? "active" : ""}
              onClick={() => setDestino("todos")}
            >
              Todos os destinos
            </button>

            <button
              className={destino === "surpresa" ? "active" : ""}
              onClick={() => setDestino("surpresa")}
            >
              🎲 Me surpreenda
            </button>
          </div>
        </div>

        <div className="card">
          <label>📅 Quando você quer viajar?</label>
          <div className="options">
            <button
              className={quando === "flexivel" ? "active" : ""}
              onClick={() => setQuando("flexivel")}
            >
              Flexível
            </button>

            <button
              className={quando === "fds" ? "active" : ""}
              onClick={() => setQuando("fds")}
            >
              Final de semana
            </button>

            <button
              className={quando === "feriado" ? "active" : ""}
              onClick={() => setQuando("feriado")}
            >
              Feriado
            </button>
          </div>
        </div>

        <div className="criterio">
          🔥 Você será avisado apenas quando o preço estiver
          <b> 35% ou mais abaixo da média.</b>
        </div>

        <button className="cta">🚀 Criar alerta</button>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #fdf2ff, #e0f2ff, #eafff4);
        }

        .pf-bg {
          position: fixed;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.6;
          animation: float 8s ease-in-out infinite;
        }

        .blob1 {
          width: 300px;
          height: 300px;
          background: #ff6bd6;
          top: 10%;
          left: -80px;
        }

        .blob2 {
          width: 400px;
          height: 400px;
          background: #4f7cff;
          top: 20%;
          right: -100px;
        }

        .blob3 {
          width: 350px;
          height: 350px;
          background: #34d399;
          bottom: -120px;
          left: 30%;
        }

        .spark {
          position: absolute;
          font-size: 22px;
          animation: pop 3s ease-in-out infinite;
        }

        .s1 { top: 15%; left: 20%; }
        .s2 { top: 25%; right: 20%; }
        .s3 { bottom: 20%; left: 15%; }
        .s4 { bottom: 15%; right: 25%; }

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pop {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 500px;
          margin: 60px auto;
          padding: 20px;
        }

        h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }

        p {
          color: #555;
          margin-bottom: 30px;
        }

        .card {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 16px;
          margin-bottom: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ddd;
          margin-top: 10px;
        }

        .options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
        }

        .options button {
          padding: 10px;
          border-radius: 12px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
        }

        .options button.active {
          background: #4f7cff;
          color: white;
          border: none;
        }

        .criterio {
          background: #fff3e6;
          padding: 15px;
          border-radius: 14px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .cta {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(90deg, #4f7cff, #ff6bd6);
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .cta:hover {
          transform: scale(1.03);
        }
      `}</style>
    </>
  );
}
