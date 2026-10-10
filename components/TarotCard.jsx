"use client";

import { useState } from "react";
import { GLYPH } from "../lib/cards";
import styles from "./TarotCard.module.css";

const MOTIF_GLYPH = {
  cliff: "❖", wand: "▲", moon: "☽", wheat: "❧", throne: "♛", keys: "⚿",
  twins: "☊", chariot: "➶", lion: "♌", lantern: "✦", wheel: "❂",
  scales: "⚖", gallows: "△", rose: "✿", "cups-pour": "⧉", chains: "⛓",
  lightning: "ϟ", stars: "✧", "moon-path": "☾", sun: "☉", trumpet: "♪",
  wreath: "❦", wands: "▲", cups: "☾", swords: "⚔", pentacles: "⛤",
};

/**
 * Signature gold-foil card. Click (or Enter/Space) flips back ↔ face.
 * Per-card `palette` + `motif` give each card its own art direction.
 */
export default function TarotCard({ card, orientation = "upright", startFlipped = true, size = "md", onFlip, interactive = true }) {
  const [flipped, setFlipped] = useState(startFlipped);

  const toggle = () => {
    const next = !flipped;
    setFlipped(next);
    onFlip?.(next);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  const [c1, c2] = card.palette;
  const emblem = MOTIF_GLYPH[card.motif] ?? "✧";
  const suitGlyph = card.suit ? GLYPH[card.suit] : null;

  const face = (
    <span className={styles.inner}>
      {/* Back: moon-seal, always identical so picks stay blind */}
      <span className={`${styles.face} ${styles.back}`} aria-hidden={flipped}>
        <span className={styles.backSeal}>☾</span>
        <span className={styles.backRing} />
        <span className={styles.backName} translate="no">Tarot</span>
      </span>
      {/* Face: per-card art direction */}
      <span
        className={`${styles.face} ${styles.front}`}
        aria-hidden={!flipped}
        style={{ "--c1": c1, "--c2": c2 }}
      >
        <span className={styles.frame}>
          <span className={styles.numeral}>
            {card.arcana === "major" ? roman(card.number) : suitGlyph}
          </span>
          <span className={styles.emblem} aria-hidden="true">{emblem}</span>
          <span className={styles.band} />
          <span className={styles.cardName}>{card.name}</span>
          <span className={styles.meta}>
            {card.arcana === "major" ? "Major Arcana" : `${suitName(card.suit)} · ${card.element}`}
          </span>
          {orientation === "reversed" && <span className={styles.revTag}>Reversed</span>}
        </span>
      </span>
    </span>
  );

  if (!interactive) {
    return (
      <div className={`${styles.wrap} ${styles[size]}`}>
        <span className={`${styles.scene} ${styles.static} ${flipped ? styles.isFlipped : ""}`}>
          {face}
        </span>
      </div>
    );
  }

  return (
    <div className={`${styles.wrap} ${styles[size]}`}>
      <button
        type="button"
        className={`${styles.scene} ${flipped ? styles.isFlipped : ""}`}
        onClick={toggle}
        onKeyDown={onKeyDown}
        aria-pressed={flipped}
        aria-label={`${card.name} card · activate to ${flipped ? "hide" : "reveal"}`}
      >
        {face}
      </button>
    </div>
  );
}

function roman(n) {
  const table = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
  return table[n] ?? String(n);
}

function suitName(s) {
  return { wands: "Wands", cups: "Cups", swords: "Swords", pentacles: "Pentacles" }[s] ?? "";
}
