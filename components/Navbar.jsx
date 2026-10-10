import Link from "next/link";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "/cards", label: "Cards" },
  { href: "/daily", label: "Daily Draw" },
  { href: "/spread", label: "Threefold Spread" },
  { href: "/yes-no", label: "Yes / No" },
  { href: "/learn", label: "Learn" },
];

export default function Navbar() {
  return (
    <header className={styles.bar}>
      <nav className={styles.nav} aria-label="Primary">
        <Link href="/" className={styles.brand} translate="no">
          <span className={styles.sig} aria-hidden="true">
            ☾
          </span>
          Tarot
        </Link>
        <ul className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
