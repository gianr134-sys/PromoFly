"use client";

import { useMemo, useState } from "react";

export default function AlertaPage() {
  const [origem, setOrigem] = useState("");
  const [destinoModo, setDestinoModo] = useState("escolher"); // escolher | todos | surpresa
  const [destino, setDestino] = useState("");
  const [quando, setQuando] = useState("flexivel"); // flexivel | fds | feriado

  const [flexIdaIni, setFlexIdaIni] = useState("");
  const [flexIdaFim, setFlexIdaFim] = useState("");
  const [flexVoltaIni, setFlexVoltaIni] = useState("");
  const [flexVoltaFim, setFlexVoltaFim] = useState("");
  const [duracaoMin, setDuracaoMin] = useState("");
  const [duracaoMax, setDuracaoMax] = useState("");

  const feriados = useMemo(
    () => [
      "Carnaval",
      "Semana Santa",
      "Tiradentes",
      "Dia do Trabalhador",
      "Corpus Christi",
      "Independência",
      "Nossa Senhora Aparecida",
      "Finados",
      "Proclamação da República",
      "Natal",
      "Réveillon",
    ],
    []
  );

  const [feriadoEscolhido, setFeriadoEscolhido] = useState(feriados[0]);
  const [emendar, setEmendar] = useState("0"); // 0 | 1 | 2
  const [flexDia, setFlexDia] = useState(false);

  const podeCriar =
    origem.trim().length >= 2 &&
    (destinoModo !== "escolher" || destino.trim().length >= 2);

  function criarAlerta() {
    if (!podeCriar) return;

    const payload = {
      origem,
      destinoModo,
      destino: destinoModo === "escolher" ? destino : destinoModo,
      quando,
      detalhes:
        quando === "flexivel"
          ? {
              ida: { de: flexIdaIni, ate: flexIdaFim },
              volta: { de: flexVoltaIni, ate: flexVoltaFim },
              duracao: { min: duracaoMin, max: duracaoMax },
            }
          : quando === "fds"
          ? { tipo: "final_de_semana" }
          : { feriado: feriadoEscolhido, emendar, flexDia },
      criterio: "🔥 só espetacular (>=35% abaixo da média)",
    };

    alert(
      "✅ Alerta criado!\n\n" +
        "Origem: " +
        payload.origem +
        "\nDestino: " +
        (destinoModo === "escolher" ? payload.destino : destinoModo) +
        "\nModo: " +
        payload.quando +
        "\n\n(Próximo passo: salvar de verdade + ligar Amadeus)"
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <Header />

        <Card title="📍 De onde você sai?" subtitle="Origem é obrigatória (aeroporto ou estado).">
          <input
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            placeholder="Ex: São Paulo, GRU, Rio de Janeiro…"
            style={styles.input}
          />
          <Tip>Exemplos: “SP”, “São Paulo”, “GRU”, “BH”, “Recife”</Tip>
        </Card>

        <Card title="🎯 Para onde?" subtitle="Escolha um destino… ou deixe o PromoFly te surpreender.">
          <Pills
            value={destinoModo}
            onChange={setDestinoModo}
            items={[
              { key: "escolher", label: "Escolher destino" },
              { key: "todos", label: "Todos os destinos" },
              { key: "surpresa", label: "🎲 Me surpreenda" },
            ]}
          />

          {destinoModo === "escolher" ? (
            <div style={{ marginTop: 12 }}>
              <input
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Ex: João Pessoa, JPA, Gramado, Salvador…"
                style={styles.input}
              />
              <Tip>
                Pode ser cidade/estado/aeroporto. (No futuro colocaremos lista com busca.)
              </Tip>
            </div>
          ) : destinoModo === "surpresa" ? (
            <FunBox>
              🎲 <b>Me surpreenda</b> = o PromoFly procura a <b>melhor oportunidade</b> e te avisa só
              quando for <b>🔥 espetacular</b>.
            </FunBox>
          ) : (
            <FunBox>
              🌎 <b>Todos os destinos</b> = você só escolhe a origem, e a gente caça as promoções
              mais absurdas.
            </FunBox>
          )}
        </Card>

        <Card title="🗓 Quando você quer viajar?" subtitle="Escolha o estilo da sua viagem.">
          <Pills
            value={quando}
            onChange={setQuando}
            items={[
              { key: "flexivel", label: "🎲 Flexível" },
              { key: "fds", label: "🌙 Final de semana" },
              { key: "feriado", label: "🎉 Feriado" },
            ]}
          />

          {quando === "flexivel" && (
            <div style={{ marginTop: 14 }}>
              <div style={styles.grid2}>
                <Field label="📅 Ida (de)">
                  <input
                    type="date"
                    value={flexIdaIni}
                    onChange={(e) => setFlexIdaIni(e.target.value)}
                    style={styles.input}
                  />
                </Field>
                <Field label="📅 Ida (até)">
                  <input
                    type="date"
                    value={flexIdaFim}
                    onChange={(e) => setFlexIdaFim(e.target.value)}
                    style={styles.input}
                  />
                </Field>
                <Field label="↩️ Volta (de)">
                  <input
                    type="date"
                    value={flexVoltaIni}
                    onChange={(e) => setFlexVoltaIni(e.target.value)}
                    style={styles.input}
                  />
                </Field>
                <Field label="↩️ Volta (até)">
                  <input
                    type="date"
                    value={flexVoltaFim}
                    onChange={(e) => setFlexVoltaFim(e.target.value)}
                    style={styles.input}
                  />
                </Field>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={styles.grid2}>
                  <Field label="⏳ Duração mín (dias)">
                    <input
                      inputMode="numeric"
                      value={duracaoMin}
                      onChange={(e) => setDuracaoMin(e.target.value)}
                      placeholder="Ex: 3"
                      style={styles.input}
                    />
                  </Field>
                  <Field label="⏳ Duração máx (dias)">
                    <input
                      inputMode="numeric"
                      value={duracaoMax}
                      onChange={(e) => setDuracaoMax(e.target.value)}
                      placeholder="Ex: 10"
                      style={styles.input}
                    />
                  </Field>
                </div>
                <Tip>Deixe em branco se quiser “qualquer duração”.</Tip>
              </div>
            </div>
          )}

          {quando === "fds" && (
            <FunBox>
              🌙 <b>Final de semana</b> = a gente prioriza idas na sexta/sábado e volta no domingo/segunda,
              buscando o preço mais absurdo.
            </FunBox>
          )}

          {quando === "feriado" && (
            <div style={{ marginTop: 14 }}>
              <Field label="🎉 Qual feriado?">
                <select
                  value={feriadoEscolhido}
                  onChange={(e) => setFeriadoEscolhido(e.target.value)}
                  style={styles.select}
                >
                  {feriados.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </Field>

              <div style={{ marginTop: 10 }}>
                <Field label="🧩 Emendar quantos dias?">
                  <Pills
                    value={emendar}
                    onChange={setEmendar}
                    items={[
                      { key: "0", label: "0" },
                      { key: "1", label: "+1" },
                      { key: "2", label: "+2" },
                    ]}
                    compact
                  />
                </Field>
              </div>

              <label style={styles.switchRow}>
                <input
                  type="checkbox"
                  checked={flexDia}
                  onChange={(e) => setFlexDia(e.target.checked)}
                />
                <span>
                  Aceito viajar <b>1 dia antes/depois</b>
                </span>
              </label>

              <Tip>Isso aumenta muito as chances de achar uma promo 🔥 sem perder o feriado.</Tip>
            </div>
          )}
        </Card>

        <div style={styles.criteria}>
          <div style={styles.criteriaBadge}>🔥 Critério</div>
          <div style={styles.criteriaText}>
            Você será avisado <b>apenas</b> quando o preço estiver <b>35% ou mais abaixo da média</b>.
            <div style={{ marginTop: 6, opacity: 0.85 }}>
              (Sem spam. Só pancada.)
            </div>
          </div>
        </div>

        <button
          onClick={criarAlerta}
          disabled={!podeCriar}
          style={{
            ...styles.cta,
            opacity: podeCriar ? 1 : 0.55,
            transform: podeCriar ? "translateY(0)" : "translateY(0)",
          }}
        >
          Criar alerta 🚀
        </button>

        <div style={styles.footerNote}>
          Próximo passo: salvar alertas de verdade + ligar o Amadeus pra buscar preços reais.
        </div>
      </div>
    </main>
  );
}

function Header() {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={styles.brandRow}>
        <div style={styles.logo}>✈️</div>
        <div>
          <div style={styles.brand}>PromoFly</div>
          <div style={styles.tagline}>Promoção de voo do jeito divertido 😄</div>
        </div>
      </div>

      <h1 style={styles.h1}>Criar alerta 🔥</h1>
      <p style={styles.p}>
        Você não pesquisa. Você só cria o alerta e o PromoFly caça o preço <b>espetacular</b>.
      </p>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <section style={styles.card}>
      <div style={styles.cardTop}>
        <div style={styles.cardTitle}>{title}</div>
        <div style={styles.cardSub}>{subtitle}</div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={styles.fieldLabel}>{label}</div>
      {children}
    </div>
  );
}

function Tip({ children }) {
  return <div style={styles.tip}>{children}</div>;
}

function FunBox({ children }) {
  return <div style={styles.funBox}>{children}</div>;
}

function Pills({ value, onChange, items, compact }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {items.map((it) => {
        const active = value === it.key;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            style={{
              ...styles.pill,
              padding: compact ? "10px 12px" : "12px 14px",
              borderColor: active ? "rgba(99,102,241,0.55)" : "rgba(0,0,0,0.10)",
              background: active
                ? "linear-gradient(135deg, rgba(99,102,241,0.22), rgba(6,182,212,0.15))"
                : "rgba(255,255,255,0.75)",
              boxShadow: active ? "0 12px 24px rgba(99,102,241,0.15)" : "0 10px 20px rgba(2,6,23,0.06)",
              fontWeight: active ? 900 : 800,
            }}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 18,
    fontFamily: "system-ui",
    background:
      "radial-gradient(900px 520px at 10% 0%, rgba(99,102,241,0.26), transparent 60%)," +
      "radial-gradient(900px 520px at 90% 10%, rgba(6,182,212,0.22), transparent 55%)," +
      "linear-gradient(180deg, #f8fafc, #eef2ff)",
  },
  shell: {
    maxWidth: 460,
    margin: "0 auto",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, rgba(99,102,241,0.35), rgba(6,182,212,0.28))",
    border: "1px solid rgba(99,102,241,0.25)",
    boxShadow: "0 16px 32px rgba(2,6,23,0.10)",
    fontSize: 20,
  },
  brand: { fontWeight: 1000, letterSpacing: -0.3, fontSize: 18, color: "#0f172a" },
  tagline: { fontSize: 12.5, color: "rgba(15,23,42,0.70)", fontWeight: 700 },
  h1: { fontSize: 28, margin: "6px 0 6px", letterSpacing: -0.6, color: "#0f172a" },
  p: { margin: 0, color: "rgba(15,23,42,0.75)", fontSize: 14.5, lineHeight: 1.4 },

  card: {
    background: "rgba(255,255,255,0.72)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    border: "1px solid rgba(99,102,241,0.18)",
    boxShadow: "0 18px 36px rgba(2,6,23,0.08)",
    backdropFilter: "blur(10px)",
  },
  cardTop: { marginBottom: 12 },
  cardTitle: { fontWeight: 1000, fontSize: 16, color: "#0f172a" },
  cardSub: { fontSize: 12.5, color: "rgba(15,23,42,0.68)", marginTop: 4, fontWeight: 700 },

  fieldLabel: { fontSize: 12.5, color: "rgba(15,23,42,0.78)", marginBottom: 6, fontWeight: 900 },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.92)",
    outline: "none",
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
  },
  select: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.92)",
    outline: "none",
    fontSize: 15,
    fontWeight: 800,
    color: "#0f172a",
  },
  pill: {
    borderRadius: 999,
    border: "2px solid rgba(0,0,0,0.10)",
    cursor: "pointer",
    fontSize: 14,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  tip: {
    marginTop: 8,
    fontSize: 12.5,
    color: "rgba(15,23,42,0.62)",
    fontWeight: 700,
  },
  funBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 16,
    background: "linear-gradient(135deg, rgba(99,102,241,0.14), rgba(6,182,212,0.10))",
    border: "1px solid rgba(99,102,241,0.22)",
    color: "rgba(15,23,42,0.88)",
    fontWeight: 750,
    lineHeight: 1.35,
  },
  switchRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: 12,
    fontWeight: 800,
    color: "rgba(15,23,42,0.82)",
  },

  criteria: {
    display: "flex",
    gap: 12,
    alignItems: "stretch",
    padding: 14,
    borderRadius: 18,
    background: "linear-gradient(135deg, rgba(255,199,0,0.16), rgba(255,120,0,0.10))",
    border: "1px solid rgba(255,140,0,0.30)",
    boxShadow: "0 14px 28px rgba(255,140,0,0.10)",
    marginBottom: 14,
  },
  criteriaBadge: {
    minWidth: 92,
    display: "grid",
    placeItems: "center",
    borderRadius: 14,
    background: "rgba(255,255,255,0.70)",
    border: "1px solid rgba(255,140,0,0.25)",
    fontWeight: 1000,
    color: "#7c2d12",
  },
  criteriaText: { fontSize: 13.5, fontWeight: 800, color: "rgba(15,23,42,0.88)" },

  cta: {
    width: "100%",
    padding: 16,
    borderRadius: 18,
    border: "none",
    background: "linear-gradient(90deg, #6366f1, #06b6d4)",
    color: "#fff",
    fontSize: 17,
    fontWeight: 1000,
    letterSpacing: 0.2,
    boxShadow: "0 20px 34px rgba(99,102,241,0.22)",
    cursor: "pointer",
  },
  footerNote: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12.5,
    color: "rgba(15,23,42,0.62)",
    fontWeight: 700,
  },
};
