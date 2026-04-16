export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        
        {/* NAVBAR */}
        <div
          style={{
            width: "100%",
            background: "white",
            borderBottom: "1px solid #e5e7eb",
            padding: "16px 24px",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* LOGO */}
            <a
              href="/painel"
              style={{
                fontSize: 24,
                fontWeight: 900,
                textDecoration: "none",
                color: "#111827",
              }}
            >
              PromoFly ✈️
            </a>

            {/* MENU */}
            <div style={{ display: "flex", gap: 12 }}>
              <a style={botao("#3b82f6")} href="/painel">
                Painel
              </a>

              <a style={botao("#10b981")} href="/buscar">
                Buscar
              </a>

              <a style={botao("#f59e0b")} href="/oportunidades">
                Promoções
              </a>
            </div>
          </div>
        </div>

        {/* CONTEÚDO */}
        {children}

      </body>
    </html>
  );
}

function botao(cor) {
  return {
    background: cor,
    color: "white",
    padding: "10px 18px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
  };
}
