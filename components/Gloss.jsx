"use client";

import { useRef, useState } from "react";
import { GLOSSARY } from "../lib/glossary";
import styles from "./Gloss.module.css";

/**
 * An arcane word with a dotted gold underline. Hovering or keyboard-focusing
 * reveals its meaning and synonyms in a tooltip that places itself where
 * there is room: above the word by default, below it near the viewport top,
 * and shifted inward near the viewport edges.
 * Usage: <Gloss w="liminal" /> or <Gloss w="augury" cap /> for sentence case.
 */
export default function Gloss({ w, cap = false }) {
  const key = w.toLowerCase();
  const entry = GLOSSARY[key];
  const wordRef = useRef(null);
  const tipRef = useRef(null);
  const [placement, setPlacement] = useState({ side: "above", shift: 0 });
  if (!entry) return w;
  const word = cap ? w.charAt(0).toUpperCase() + w.slice(1) : w;

  const place = () => {
    const wordEl = wordRef.current;
    const tipEl = tipRef.current;
    if (!wordEl || !tipEl) return;
    const rect = wordEl.getBoundingClientRect();
    const tipHeight = tipEl.offsetHeight;
    const tipWidth = tipEl.offsetWidth;
    const gap = 10;

    const roomAbove = rect.top;
    const roomBelow = window.innerHeight - rect.bottom;
    const fitsAbove = roomAbove >= tipHeight + gap;
    const side = fitsAbove || roomAbove >= roomBelow ? "above" : "below";

    const margin = 8;
    const centeredLeft = rect.left + rect.width / 2 - tipWidth / 2;
    const clampedLeft = Math.min(
      Math.max(centeredLeft, margin),
      Math.max(margin, window.innerWidth - tipWidth - margin)
    );
    setPlacement({ side, shift: clampedLeft - centeredLeft });
  };

  return (
    <span
      ref={wordRef}
      className={styles.glo}
      tabIndex={0}
      onMouseEnter={place}
      onFocus={place}
      aria-label={`${word}: ${entry.meaning} Synonyms: ${entry.synonyms.join(", ")}.`}
    >
      {word}
      <span
        ref={tipRef}
        role="tooltip"
        aria-hidden="true"
        data-side={placement.side}
        style={{ "--shift": `${placement.shift}px` }}
        className={styles.tip}
      >
        <span className={styles.meaning}>{entry.meaning}</span>
        <span className={styles.syns}>{entry.synonyms.join(" · ")}</span>
      </span>
    </span>
  );
}
