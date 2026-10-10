import { GLOSSARY } from "../lib/glossary";
import styles from "./Gloss.module.css";

/**
 * An arcane word with a dotted gold underline. Hovering or keyboard-focusing
 * reveals its meaning and synonyms in a tooltip above the word.
 * Usage: <Gloss w="liminal" /> or <Gloss w="augury" cap /> for sentence case.
 */
export default function Gloss({ w, cap = false }) {
  const key = w.toLowerCase();
  const entry = GLOSSARY[key];
  if (!entry) return w;
  const word = cap ? w.charAt(0).toUpperCase() + w.slice(1) : w;

  return (
    <span
      className={styles.glo}
      tabIndex={0}
      aria-label={`${word}: ${entry.meaning} Synonyms: ${entry.synonyms.join(", ")}.`}
    >
      {word}
      <span className={styles.tip} role="tooltip" aria-hidden="true">
        <span className={styles.meaning}>{entry.meaning}</span>
        <span className={styles.syns}>{entry.synonyms.join(" · ")}</span>
      </span>
    </span>
  );
}
