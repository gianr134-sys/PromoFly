export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>PromoFly ✈️🔥</h1>
      <p>As melhores promoções de voos, sem precisar pesquisar.</p>

      <button style={{
        marginTop: 16,
        padding: "12px 16px",
        borderRadius: 10,
        border: "none",
        background: "#2563eb",
        color: "#fff",
        fontSize: 16
      }}>
        Criar alerta de voo
      </button>
    </main>
  );
}
