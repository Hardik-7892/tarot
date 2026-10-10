import Link from "next/link";
import { CARDS } from "../../../lib/cards";
import PrintButton from "./print-button";

export const metadata = {
  title: "Cheat-Sheet · Tarot",
  description:
    "All 78 tarot cards on one printable page: upright and reversed one-liners plus yes/no lean.",
};

const GROUPS = [
  { id: "major", title: "Major Arcana", test: (c) => c.arcana === "major" },
  { id: "wands", title: "Wands · Fire", test: (c) => c.suit === "wands" },
  { id: "cups", title: "Cups · Water", test: (c) => c.suit === "cups" },
  { id: "swords", title: "Swords · Air", test: (c) => c.suit === "swords" },
  { id: "pentacles", title: "Pentacles · Earth", test: (c) => c.suit === "pentacles" },
];

const YES_NO_CLS = {
  Yes: "text-[#b8e6b8]",
  No: "text-[#e8a0a0]",
  Unclear: "text-moon",
};

/**
 * M7: all 78 cards as compact grouped tables. Static render; print CSS
 * flips to black-on-white and hides site chrome for a clean page.
 */
export default function CheatSheet() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-12">
      <style>{`
        @media print {
          body { background: #fff !important; color: #111 !important; }
          header, footer, canvas, .skip-link { display: none !important; }
          main { display: block !important; }
          .cheat-card { border-color: #999 !important; background: #fff !important; }
          .cheat-card h2, .cheat-card a, .cheat-card td, .cheat-card th { color: #111 !important; }
          .cheat-dim { color: #444 !important; }
          .cheat-section { break-inside: avoid; }
          .cheat-table tr { break-inside: avoid; }
        }
      `}</style>

      <h1 className="mb-3 text-center font-display text-[clamp(2.2rem,5vw,3.2rem)] text-parchment">
        Cheat-Sheet
      </h1>
      <p className="mx-auto mb-6 max-w-[36rem] text-center leading-relaxed text-muted cheat-dim">
        All 78 cards: the upright line, the reversed shade, and the yes/no
        lean. Print it, fold it into your journal, argue with it.
      </p>
      <div className="mb-10 flex justify-center">
        <PrintButton />
      </div>

      {GROUPS.map((g) => {
        const cards = CARDS.filter(g.test);
        return (
          <section key={g.id} aria-labelledby={`cheat-${g.id}`} className="cheat-section mb-8">
            <h2
              id={`cheat-${g.id}`}
              className="mb-3 font-display text-2xl text-goldbright"
            >
              {g.title} · {cards.length}
            </h2>
            <div className="cheat-card overflow-x-auto rounded-[14px] border border-gold/25">
              <table className="cheat-table w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  {g.title}: upright, reversed, and yes/no for each card
                </caption>
                <thead>
                  <tr className="border-b border-gold/25 text-xs uppercase tracking-[0.2em] text-gold">
                    <th scope="col" className="px-4 py-3 font-semibold">Card</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Upright</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Reversed</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Y/N</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((c) => (
                    <tr key={c.id} className="border-b border-gold/10 align-top last:border-0">
                      <th scope="row" className="whitespace-nowrap px-4 py-2.5 font-display text-base font-semibold">
                        <Link href={`/cards/${c.id}`} className="text-parchment hover:text-goldbright">
                          {c.name}
                        </Link>
                      </th>
                      <td className="px-4 py-2.5 leading-relaxed">{c.upright}</td>
                      <td className="px-4 py-2.5 leading-relaxed text-muted cheat-dim">{c.reversed}</td>
                      <td className={`whitespace-nowrap px-4 py-2.5 font-semibold ${YES_NO_CLS[c.yesNo] ?? ""}`}>
                        {c.yesNo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
