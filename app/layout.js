export const metadata = {
  title: "Meridian Web",
  description: "Meridian Next.js control plane",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", margin: 0, padding: 16 }}>{children}</body>
    </html>
  );
}
