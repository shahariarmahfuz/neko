export const metadata = {
  title: "Buy/Sell Platform (Turso Mini)",
  description: "Minimal buy/sell platform using Next.js + Turso (libSQL)"
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
