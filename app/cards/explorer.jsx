"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CARDS } from "../../lib/cards";
import TarotCard from "../../components/TarotCard";
import Gloss from "../../components/Gloss";

const FILTERS = [
  { id: "all", label: "All 78" },
  { id: "major", label: "Major Arcana" },
  { id: "wands", label: "Wands" },
  { id: "cups", label: "Cups" },
  { id: "swords", label: "Swords" },
  { id: "pentacles", label: "Pentacles" },
];

const chipBase =
  "cursor-pointer rounded-full border px-4 py-2 text-sm tracking-wide transition-colors";

export default function CardsExplorer() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CARDS.filter((c) => {
      const inFilter =
        filter === "all" ||
        (filter === "major" ? c.arcana === "major" : c.suit === filter);
      const inQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q));
      return inFilter && inQuery;
    });
  }, [query, filter]);

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

      <div role="group" aria-label="Filter by suit or arcana" className="mb-4 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={
              filter === f.id
                ? `${chipBase} border-goldbright bg-linear-to-b from-goldbright to-gold font-bold text-[#14100a]`
                : `${chipBase} border-gold/35 bg-transparent text-ink hover:border-goldbright hover:text-goldbright`
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="text-center text-sm tabular-nums text-muted">
        Showing {new Intl.NumberFormat("en-US").format(results.length)} of{" "}
        {new Intl.NumberFormat("en-US").format(CARDS.length)} cards
      </p>

      {results.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p>No cards match “{query}”. Try a suit name or a keyword like “hope”.</p>
          <button
            type="button"
            onClick={() => { setQuery(""); setFilter("all"); }}
            className="mt-4 cursor-pointer rounded-full border border-gold px-6 py-2 text-[0.95rem] text-goldbright hover:bg-gold/10"
          >
            Clear Search &amp; Filters
          </button>
        </div>
      ) : (
        <ul role="list" className="m-0 mt-6 grid list-none justify-items-center gap-x-4 gap-y-6 p-0 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]">
          {results.map((c) => (
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
