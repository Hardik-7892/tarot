"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CARDS } from "../../lib/cards";
import TarotCard from "../../components/TarotCard";
import Gloss from "../../components/Gloss";

const SUIT_FILTERS = [
  { id: "all", label: "All 78" },
  { id: "major", label: "Major Arcana" },
  { id: "wands", label: "Wands" },
  { id: "cups", label: "Cups" },
  { id: "swords", label: "Swords" },
  { id: "pentacles", label: "Pentacles" },
];

const ELEMENTS = ["all", "Fire", "Water", "Air", "Earth"];
const OMENS = ["all", "Yes", "No", "Unclear"];
const KINDS = [
  { id: "all", label: "All types" },
  { id: "court", label: "Court cards" },
  { id: "pip", label: "Pip cards" },
];

const COURT_RANKS = ["page", "knight", "queen", "king"];

const chipBase =
  "cursor-pointer rounded-full border px-4 py-2 text-sm tracking-wide transition-colors";

function chip(active) {
  return active
    ? `${chipBase} border-goldbright bg-linear-to-b from-goldbright to-gold font-bold text-[#14100a]`
    : `${chipBase} border-gold/35 bg-transparent text-ink hover:border-goldbright hover:text-goldbright`;
}

function kindOf(card) {
  if (!card.suit) return "major";
  return COURT_RANKS.includes(card.rank) ? "court" : "pip";
}

/** Crypto random index, Math.random fallback during prerender. */
function randIndex(n) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % n;
  }
  return Math.floor(Math.random() * n);
}

/**
 * M9: search + four composing filter groups (suit, element, omen, kind)
 * plus a random card jump. All state is local; nothing is stored.
 */
export default function CardsExplorer() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suit, setSuit] = useState("all");
  const [element, setElement] = useState("all");
  const [omen, setOmen] = useState("all");
  const [kind, setKind] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CARDS.filter((c) => {
      if (suit === "major" ? c.arcana !== "major" : suit !== "all" && c.suit !== suit)
        return false;
      if (element !== "all" && c.element !== element) return false;
      if (omen !== "all" && c.yesNo !== omen) return false;
      if (kind !== "all" && kindOf(c) !== kind) return false;
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !c.keywords.some((k) => k.toLowerCase().includes(q))
      )
        return false;
      return true;
    });
  }, [query, suit, element, omen, kind]);

  const hasFilters =
    query.trim() !== "" || suit !== "all" || element !== "all" || omen !== "all" || kind !== "all";

  const reset = () => {
    setQuery("");
    setSuit("all");
    setElement("all");
    setOmen("all");
    setKind("all");
  };

  const surprise = () => {
    router.push(`/cards/${CARDS[randIndex(CARDS.length)].id}`);
  };

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-12">
      <h1 className="mb-3 text-center font-display text-[clamp(2.2rem,5vw,3.2rem)] text-parchment">
        Explore the Deck
      </h1>
      <p className="mx-auto mb-8 max-w-[36rem] text-center leading-relaxed text-muted">
        Every card below is a <Gloss w="palimpsest" /> of meaning. Search all
        78 by name or keyword, then select any card for its full upright &amp;
        reversed counsel.
      </p>

      <div className="mx-auto mb-5 flex max-w-[32rem] flex-col gap-2">
        <label htmlFor="card-search" className="text-xs uppercase tracking-[0.25em] text-gold">
          Search cards
        </label>
        <input
          id="card-search"
          name="q"
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Try “moon”, “grief”, “victory”…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-xl border border-gold/40 bg-abyss px-4 py-3 text-lg text-ink placeholder:text-muted"
        />
      </div>

      <div className="mb-5 flex justify-center">
        <button
          type="button"
          onClick={surprise}
          className="cursor-pointer rounded-full border border-gold/55 px-6 py-2 text-[0.95rem] font-semibold text-goldbright transition hover:-translate-y-0.5 hover:border-goldbright hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
        >
          Reveal a random card →
        </button>
      </div>

      <div role="group" aria-label="Filter by suit or arcana" className="mb-3 flex flex-wrap justify-center gap-2">
        {SUIT_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={suit === f.id}
            onClick={() => setSuit(f.id)}
            className={chip(suit === f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mb-4 grid justify-items-center gap-3 md:grid-cols-3">
        <div role="group" aria-label="Filter by element" className="flex flex-wrap justify-center gap-2">
          {ELEMENTS.map((e) => (
            <button
              key={e}
              type="button"
              aria-pressed={element === e}
              onClick={() => setElement(e)}
              className={chip(element === e)}
            >
              {e === "all" ? "Any element" : e}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Filter by yes or no lean" className="flex flex-wrap justify-center gap-2">
          {OMENS.map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={omen === o}
              onClick={() => setOmen(o)}
              className={chip(omen === o)}
            >
              {o === "all" ? "Any omen" : o}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Filter by court or pip" className="flex flex-wrap justify-center gap-2">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              aria-pressed={kind === k.id}
              onClick={() => setKind(k.id)}
              className={chip(kind === k.id)}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p aria-live="polite" className="m-0 text-center text-sm tabular-nums text-muted">
          Showing {new Intl.NumberFormat("en-US").format(filtered.length)} of{" "}
          {new Intl.NumberFormat("en-US").format(CARDS.length)} cards
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer bg-transparent p-0 text-sm text-moon underline underline-offset-2 hover:text-goldbright"
          >
            Reset search and filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p>No cards match those filters. Try widening one group.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 cursor-pointer rounded-full border border-gold px-6 py-2 text-[0.95rem] text-goldbright hover:bg-gold/10"
          >
            Clear Search &amp; Filters
          </button>
        </div>
      ) : (
        <ul role="list" className="m-0 mt-6 grid list-none justify-items-center gap-x-4 gap-y-6 p-0 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]">
          {filtered.map((c) => (
            <li key={c.id}>
              <Link
                href={`/cards/${c.id}`}
                aria-label={`${c.name} · view meaning`}
                className="block transition-transform hover:-translate-y-1.5"
              >
                <TarotCard card={c} startFlipped={true} size="sm" interactive={false} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
