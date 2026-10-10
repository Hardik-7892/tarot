import Link from "next/link";
import { SPREADS, SPREAD_PAGE_IDS, getSpread } from "../../lib/spreads";

export const metadata = {
  title: "Spreads · Tarot",
  description:
    "Choose a tarot spread: past-present-future, love, career, decision, the Celtic Cross, daily draw, or yes-no oracle.",
};

export default function SpreadIndex() {
  const subSpreads = SPREAD_PAGE_IDS.map((id) => getSpread(id));
  const daily = getSpread("daily");
  const yesNo = getSpread("yes-no");

  return (
    <div className="mx-auto max-w-[960px] px-6 py-12">
      <h1 className="mb-3 text-center font-display text-[clamp(2.2rem,5vw,3.2rem)] text-parchment">
        Choose Your Spread
      </h1>
      <p className="mx-auto mb-10 max-w-[38rem] text-center leading-relaxed text-muted">
        Every spread below is drawn blind from a shuffled fan. Pick the shape
        that fits your question — three cards for most days, ten when one
        deserves depth.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {subSpreads.map((s) => (
          <article
            key={s.id}
            className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6"
          >
            <h2 className="mb-1 font-display text-xl text-goldbright">{s.title}</h2>
            <p className="mb-1 text-xs uppercase tracking-[0.25em] text-gold">
              {s.pickCount} {s.pickCount === 1 ? "card" : "cards"}
            </p>
            <p className="mb-4 leading-relaxed">{s.description}</p>
            <Link href={s.href} className="font-semibold text-moon hover:text-goldbright">
              Cast this spread →
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {[daily, yesNo].map((s) => (
          <article
            key={s.id}
            className="rounded-[14px] border border-moon/20 p-6 text-center"
          >
            <h2 className="mb-2 font-display text-xl text-parchment">{s.title}</h2>
            <p className="mb-4 leading-relaxed">{s.description}</p>
            <Link href={s.href} className="font-semibold text-moon hover:text-goldbright">
              {s.id === "daily" ? "Draw a card →" : "Consult the oracle →"}
            </Link>
          </article>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-[36rem] text-center text-sm italic leading-relaxed text-muted">
        One draw per question. Redrawing until you like the answer is called
        “shopping” — and it unmakes the reading.
      </p>
    </div>
  );
}
