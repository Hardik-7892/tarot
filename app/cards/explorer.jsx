"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CARDS } from "../../lib/cards";
import TarotCard from "../../components/TarotCard";
import Gloss from "../../components/Gloss";
import styles from "./explorer.module.css";

const FILTERS = [
  { id: "all", label: "All 78" },
  { id: "major", label: "Major Arcana" },
  { id: "wands", label: "Wands" },
  { id: "cups", label: "Cups" },
  { id: "swords", label: "Swords" },
  { id: "pentacles", label: "Pentacles" },
];

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
    <div className={styles.wrap}>
      <h1 className={styles.title}>Explore the Deck</h1>
      <p className={styles.lede}>
        Every card below is a <Gloss w="palimpsest" /> of meaning. Search all
        78 by name or keyword, then select any card for its full upright &amp;
        reversed counsel.
      </p>

      <div className={styles.toolbar}>
        <label className={styles.searchLabel} htmlFor="card-search">
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
          className={styles.search}
        />
      </div>

      <div className={styles.filters} role="group" aria-label="Filter by suit or arcana">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${styles.chip} ${filter === f.id ? styles.active : ""}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className={styles.count} aria-live="polite">
        Showing {new Intl.NumberFormat("en-US").format(results.length)} of{" "}
        {new Intl.NumberFormat("en-US").format(CARDS.length)} cards
      </p>

      {results.length === 0 ? (
        <div className={styles.empty}>
          <p>No cards match “{query}”. Try a suit name or a keyword like “hope”.</p>
          <button type="button" className={styles.reset} onClick={() => { setQuery(""); setFilter("all"); }}>
            Clear Search &amp; Filters
          </button>
        </div>
      ) : (
        <ul className={styles.grid} role="list">
          {results.map((c) => (
            <li key={c.id}>
              <Link href={`/cards/${c.id}`} className={styles.tile} aria-label={`${c.name} · view meaning`}>
                <TarotCard card={c} startFlipped={true} size="sm" interactive={false} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
