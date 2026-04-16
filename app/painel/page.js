"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function PainelPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [alertasAtivos, setAlertasAtivos] = useState(0);
  const [promocoesEncontradas, setPromocoesEncontradas] = useState(0);

  useEffect(() => {
    carregarPainel();
  }, []);

  async function carregarPainel() {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      setLoading(false);
      alert("Faça login novamente.");
      window.location.href = "/login";
      return;
    }

    setEmail(session.user.email || "");

    const { count: totalAlertas } = await supabase
      .from("alertas")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id);

    const { count: totalPromocoes } = await supabase
      .from("oportunidades")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id);

    setAlertasAtivos(totalAlertas || 0);
    setPromocoesEncontradas(totalPromocoes || 0);
    setLoading(false);
  }

  async function sair() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #eef6ff 0%, #f8fbff 48%, #ffffff 100%)",
        padding: "32px 20px 80px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1150, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            alignItems: "flex-start",
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(42px, 7vw, 74px)",
                lineHeight: 1,
                margin: 0,
                color: "#111827",
                fontWeight: 900,
              }}
            >
              Painel PromoFly ✈️
            </h1>

            <p
              style={{
                marginTop: 16,
                fontSize: 18,
                color: "#6b7280",
                maxWidth: 760,
              }}
            >
              Bem-vindo! Aqui você gerencia seus alertas de passagens e também pode
              buscar promoções na hora.
            </p>

            {email ? (
              <div
                style={{
                  marginTop: 8,
                  color: "#374151",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                Conta: {email}
              </div>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div
            style={{
              background: "white",
              borderRadius: 28,
              padding: 28,
              border: "1px solid #e5e7eb",
            }}
          >
            Carregando painel...
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 18,
                marginBottom: 26,
              }}
            >
              <ResumoCard
                titulo="Alertas ativos"
                valor={String(alertasAtivos)}
                subtitulo="Monitoramentos cadastrados"
              />
              <ResumoCard
                titulo="Promoções encontradas"
                valor={String(promocoesEncontradas)}
                subtitulo="Oportunidades salvas no sistema"
              />
              <ResumoCard
                titulo="Conta"
                valor="Free"
                subtitulo="Plano atual"
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginBottom: 26,
              }}
            >
              <a
                href="/alerta"
                style={botaoPrimario("#e9a23b")}
              >
                Criar novo alerta
              </a>

              <a
                href="/buscar"
                style={botaoPrimario("#10b981")}
              >
                Buscar agora
              </a>

              <a
                href="/oportunidades"
                style={botaoPrimario("#3b82f6")}
              >
                Ver promoções
              </a>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,.92)",
                borderRadius: 30,
                border: "1px solid #e5e7eb",
                boxShadow: "0 20px 50px rgba(15,23,42,.05)",
                padding: 28,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 28,
                  color: "#111827",
                  fontWeight: 900,
                }}
              >
                O que você pode fazer agora
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 16,
                  marginTop: 18,
                }}
              >
                <AcaoCard
                  titulo="Criar alertas"
                  texto="Defina rotas e deixe o PromoFly monitorando por você."
                  link="/alerta"
                  textoBotao="Criar alerta"
                />

                <AcaoCard
                  titulo="Buscar na hora"
                  texto="Pesquise promoções manualmente, sem esperar um alerta automático."
                  link="/buscar"
                  textoBotao="Buscar agora"
                />

                <AcaoCard
                  titulo="Ver oportunidades"
                  texto="Abra suas promoções encontradas e vá para a busca de compra."
                  link="/oportunidades"
                  textoBotao="Abrir promoções"
                />
              </div>
            </div>

            <div style={{ marginTop: 22 }}>
              <button
                onClick={sair}
                style={{
                  background: "transparent",
                  color: "#6b7280",
                  border: "none",
                  fontSize: 15,
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Sair
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function botaoPrimario(cor) {
  return {
    background: cor,
    color: "white",
    padding: "16px 28px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 800,
    boxShadow: "0 10px 25px rgba(15,23,42,.10)",
    display: "inline-block",
  };
}

function ResumoCard({ titulo, valor, subtitulo }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.92)",
        borderRadius: 28,
        border: "1px solid #e5e7eb",
        boxShadow: "0 20px 50px rgba(15,23,42,.05)",
        padding: 24,
      }}
    >
      <div
        style={{
          color: "#6b7280",
          fontSize: 15,
          marginBottom: 12,
          fontWeight: 700,
        }}
      >
        {titulo}
      </div>

      <div
        style={{
          color: "#111827",
          fontSize: "clamp(32px, 5vw, 48px)",
          lineHeight: 1,
          fontWeight: 900,
        }}
      >
        {valor}
      </div>

      <div
        style={{
          color: "#9ca3af",
          fontSize: 14,
          marginTop: 10,
        }}
      >
        {subtitulo}
      </div>
    </div>
  );
}

function AcaoCard({ titulo, texto, link, textoBotao }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 24,
        padding: 22,
      }}
    >
      <div
        style={{
          color: "#111827",
          fontWeight: 900,
          fontSize: 22,
          marginBottom: 10,
        }}
      >
        {titulo}
      </div>

      <div
        style={{
          color: "#6b7280",
          fontSize: 15,
          lineHeight: 1.5,
          marginBottom: 16,
        }}
      >
        {texto}
      </div>

      <a
        href={link}
        style={{
          display: "inline-block",
          background: "#111827",
          color: "white",
          padding: "12px 18px",
          borderRadius: 999,
          textDecoration: "none",
          fontWeight: 800,
          fontSize: 14,
        }}
      >
        {textoBotao}
      </a>
    </div>
  );
}
