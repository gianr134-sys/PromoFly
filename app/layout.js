export const metadata = {
  title: "PromoFly",
  description: "As melhores promoções de voos, sem precisar pesquisar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "system-ui" }}>
        {children}
      </body>
    </html>
  );
}
