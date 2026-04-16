export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          background: "#f3f7ff",
        }}
      >
        {/* NAVBAR */}
        <div
          style={{
            background: "linear-gradient(90deg, #2563eb, #7c3aed)",
            padding: "16px 24px",
            color: "white",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
              }}
            >
              ✈️ PromoFly
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <a style={btn("#3b82f6")} href="/painel">
                Painel
              </a>

              <a style={btn("#10b981")} href="/buscar">
                Buscar
              </a>

              <a style={btn("#f59e0b")} href="/oportunidades">
                Promoções
              </a>
            </div>
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}

function btn(color) {
  return {
    background: color,
    color: "white",
    padding: "10px 18px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 700,
  };
}
