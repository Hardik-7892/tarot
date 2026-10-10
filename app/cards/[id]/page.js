import Link from "next/link";
import { CARDS, byId } from "../../../lib/cards";
import TarotCard from "../../../components/TarotCard";
import Gloss from "../../../components/Gloss";

export function generateStaticParams() {
  return CARDS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const card = byId(id);
  if (!card) return { title: "Card Not Found · Tarot" };
  return {
    title: `${card.name} Meaning · Tarot`,
    description: `Upright & reversed meanings, keywords, and reflections for ${card.name}.`,
  };
}

export default async function CardDetail({ params }) {
  const { id } = await params;
  const card = byId(id);

  if (!card) {
    return (
      <div className="mx-auto max-w-[860px] px-6 py-10">
        <h1 className="font-display text-4xl text-parchment">Card Not Found</h1>
        <p className="mt-4 leading-relaxed">This card slipped back into the deck.</p>
        <Link href="/cards" className="font-semibold text-moon hover:text-goldbright">
          Return to the Deck →
        </Link>
      </div>
    );
  }

  const idx = CARDS.findIndex((c) => c.id === card.id);
  const prev = CARDS[(idx - 1 + CARDS.length) % CARDS.length];
  const next = CARDS[(idx + 1) % CARDS.length];

  return (
    <div className="mx-auto max-w-[860px] px-6 py-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link href="/cards" className="font-semibold text-moon hover:text-goldbright">
          ← All Cards
        </Link>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="mb-2 font-display text-[clamp(2.4rem,6vw,3.6rem)] text-parchment">
          {card.name}
        </h1>
        <p className="mb-4 text-sm uppercase tracking-[0.12em] text-gold">
          {card.arcana === "major"
            ? `Major Arcana · ${roman(card.number)}`
            : `${card.suit[0].toUpperCase() + card.suit.slice(1)} · ${card.element}`}
          {"  ·  "}{card.astrology}
        </p>
        <div aria-label="Keywords" className="flex flex-wrap justify-center gap-2">
          {card.keywords.map((k) => (
            <span key={k} className="rounded-full border border-gold/40 px-4 py-1 text-sm">
              {k}
            </span>
          ))}
        </div>
      </header>

      <div className="mb-10 flex flex-col items-center gap-3">
        <TarotCard card={card} startFlipped={true} size="lg" />
        <p className="m-0 text-sm italic text-muted">
          Select the card to turn it over. Its <Gloss w="sibylline" /> counsel awaits.
        </p>
      </div>

      <p className="mx-auto mb-8 max-w-[40rem] text-center font-display text-2xl italic leading-relaxed text-goldbright">
        {card.essence}
      </p>

      <div className="mb-8 grid gap-5 md:grid-cols-2">
        <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
          <h2 className="mb-3 font-display text-2xl text-goldbright">Upright</h2>
          <p className="m-0 leading-relaxed">{card.upright}</p>
        </article>
        <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
          <h2 className="mb-3 font-display text-2xl text-goldbright">Reversed</h2>
          <p className="m-0 leading-relaxed">{card.reversed}</p>
        </article>
      </div>

      <article aria-labelledby="deep-title" className="mb-6 rounded-r-[14px] border-l-[3px] border-gold bg-linear-to-b from-abyss2 to-transparent p-7">
        <h2 id="deep-title" className="mb-3 font-display text-2xl text-goldbright">
          The Deeper Reading
        </h2>
        <p className="m-0 leading-loose">{card.detail}</p>
      </article>

      <div className="mb-8 grid gap-5 md:grid-cols-2">
        <article aria-labelledby="sym-title" className="rounded-[14px] border border-moon/20 p-6">
          <h2 id="sym-title" className="mb-3 font-display text-2xl text-goldbright">
            Symbolism
          </h2>
          <p className="m-0 leading-loose">{card.symbolism}</p>
        </article>
        <article aria-labelledby="refl-title" className="rounded-[14px] border border-moon/20 p-6">
          <h2 id="refl-title" className="mb-3 font-display text-2xl text-goldbright">
            Sit With This
          </h2>
          <p className="m-0 leading-loose">{card.reflection}</p>
        </article>
      </div>

      <dl className="m-0 mb-10 grid gap-4 rounded-[14px] border border-moon/20 p-5 md:grid-cols-3">
        <div className="text-center">
          <dt className="mb-1 text-xs uppercase tracking-[0.25em] text-muted">Element</dt>
          <dd className="m-0 font-display text-lg text-parchment">{card.element}</dd>
        </div>
        <div className="text-center">
          <dt className="mb-1 text-xs uppercase tracking-[0.25em] text-muted">Astrology</dt>
          <dd className="m-0 font-display text-lg text-parchment">{card.astrology}</dd>
        </div>
        <div className="text-center">
          <dt className="mb-1 text-xs uppercase tracking-[0.25em] text-muted">Yes / No</dt>
          <dd className="m-0 font-display text-lg text-parchment">{card.yesNo}</dd>
        </div>
      </dl>

      <nav aria-label="More cards" className="flex flex-wrap justify-between gap-4">
        <Link
          href={`/cards/${prev.id}`}
          className="max-w-[45%] truncate font-semibold text-moon hover:text-goldbright"
        >
          ← {prev.name}
        </Link>
        <Link
          href={`/cards/${next.id}`}
          className="max-w-[45%] truncate text-right font-semibold text-moon hover:text-goldbright"
        >
          {next.name} →
        </Link>
      </nav>
    </div>
  );
}

function roman(n) {
  const table = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
  return table[n] ?? String(n);
}
