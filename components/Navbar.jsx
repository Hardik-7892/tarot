import Link from "next/link";

const LINKS = [
  { href: "/cards", label: "Cards" },
  { href: "/daily", label: "Daily Draw" },
  { href: "/spread", label: "Threefold Spread" },
  { href: "/yes-no", label: "Yes / No" },
  { href: "/learn", label: "Learn" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-gold/25 bg-void/80 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-6 py-3 max-md:flex-col max-md:items-start"
      >
        <Link
          href="/"
          translate="no"
          className="font-display text-2xl font-bold tracking-wide text-goldbright no-underline hover:text-parchment"
        >
          <span aria-hidden="true" className="mr-2 text-moon">
            ☾
          </span>
          Tarot
        </Link>
        <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-[0.95rem] tracking-wide">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="border-b border-transparent px-0.5 py-1 text-ink transition-colors hover:border-gold hover:text-goldbright"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
