import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Starfield from "../components/Starfield";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "Tarot · Cards, Meanings & Readings",
  description:
    "Explore all 78 tarot cards, draw a blind card, cast a threefold spread, and learn the craft.",
};

export const viewport = {
  themeColor: "#0a0916",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={display.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Starfield />
        <Navbar />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <p>
            <span translate="no">Tarot</span> · for reflection &amp;
            study. Readings are symbolic, not advice.
          </p>
        </footer>
        <style>{`
          .site-footer {
            margin-top: auto;
            padding: 2.5rem 1.5rem 3rem;
            text-align: center;
            color: var(--muted);
            font-size: 0.85rem;
            letter-spacing: 0.04em;
          }
        `}</style>
      </body>
    </html>
  );
}
