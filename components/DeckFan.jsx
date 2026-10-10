"use client";

import { useMemo, useState } from "react";
import { CARD_IDS, byId } from "../lib/cards";
import { drawOrientation, shuffleDeck } from "../lib/shuffle";
import TarotCard from "./TarotCard";
import styles from "./DeckFan.module.css";

/**
 * Blind pick deck. A shuffled fan of identical facedown backs.
 * The user selects `pickCount` backs, then flips each to reveal.
 * With `verdict`, the reveal is read as an omen for a yes or no question.
 * Shuffle lives in lib/shuffle.js. Swap it for Rust WASM later.
 */
export default function DeckFan({ pickCount = 1, title = "Choose", verdict = false, onComplete }) {
  const [order, setOrder] = useState(() => shuffleDeck(CARD_IDS));
  const [picked, setPicked] = useState([]);
  const [revealed, setRevealed] = useState({});
  const [shuffling, setShuffling] = useState(false);

  const fan = useMemo(() => order.slice(0, 12), [order]);

  const reshuffle = () => {
    setShuffling(true);
    window.setTimeout(() => {
      setOrder(shuffleDeck(CARD_IDS));
      setPicked([]);
      setRevealed({});
      setShuffling(false);
    }, 450);
  };

  const pick = (deckIndex) => {
    if (picked.includes(deckIndex) || picked.length >= pickCount) return;
    const cardId = fan[deckIndex];
    const entry = { deckIndex, cardId, orientation: drawOrientation() };
    const next = [...picked, entry];
    setPicked(next);
    if (next.length === pickCount) onComplete?.(next);
  };

  const done = picked.length >= pickCount;

  return (
    <section className={styles.deck} aria-label={title}>
      <div className={styles.controls}>
        <button type="button" className={styles.shuffleBtn} onClick={reshuffle} disabled={shuffling}>
          {shuffling ? "Shuffling…" : "⟳ Shuffle the Deck"}
        </button>
        <p className={styles.hint} aria-live="polite">
          {done
            ? "Your cards are chosen. Select each one to reveal it."
            : verdict
              ? "Hold your question of yes or no in mind, then touch one card. Every back is identical."
              : `Touch ${pickCount === 1 ? "one card" : `${pickCount - picked.length} card${pickCount - picked.length === 1 ? "" : "s"}`} from the fan. Every back is identical.`}
        </p>
      </div>

      {!done ? (
        <ul className={`${styles.fan} ${shuffling ? styles.shuffling : ""}`} role="list">
          {fan.map((id, i) => {
            const taken = picked.some((p) => p.deckIndex === i);
            return (
              <li key={`${id}-${i}`} style={{ "--tilt": `${(i - 5.5) * 4}deg`, "--lift": `${Math.abs(i - 5.5) * 7}px` }}>
                <button
                  type="button"
                  className={`${styles.back} ${taken ? styles.taken : ""}`}
                  onClick={() => pick(i)}
                  disabled={taken}
                  aria-label={taken ? `Card ${i + 1} already chosen` : `Choose card ${i + 1} of 12, lying facedown`}
                >
                  <span aria-hidden="true">☾</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={styles.result}>
          {picked.map((p, n) => {
            const card = byId(p.cardId);
            return (
              <figure key={p.deckIndex} className={styles.pick}>
                <TarotCard
                  card={card}
                  orientation={p.orientation}
                  startFlipped={false}
                  size="md"
                  onFlip={(open) => setRevealed((r) => ({ ...r, [n]: open }))}
                />
                <figcaption>
                  <span className={styles.pickLabel}>{verdict ? "The Answer" : pickLabel(pickCount, n)}</span>
                  {revealed[n] ? (
                    <>
                      {verdict && (
                        <strong className={`${styles.verdict} ${styles[card.yesNo.toLowerCase()]}`} aria-live="polite">
                          {verdictText(card.yesNo)}
                        </strong>
                      )}
                      <strong className={styles.pickName}>{card.name}</strong>
                      <span className={styles.pickOri}>{p.orientation === "reversed" ? "Reversed" : "Upright"}</span>
                      <span className={styles.pickMeaning}>
                        {p.orientation === "reversed" ? card.reversed : card.upright}
                      </span>
                    </>
                  ) : (
                    <span className={styles.pickHidden}>Select the card to reveal it…</span>
                  )}
                </figcaption>
              </figure>
            );
          })}
          <button type="button" className={styles.shuffleBtn} onClick={reshuffle}>
            Draw Again
          </button>
        </div>
      )}
    </section>
  );
}

function pickLabel(count, n) {
  if (count === 1) return "Your Card";
  return ["Past", "Present", "Future"][n] ?? `Card ${n + 1}`;
}

function verdictText(yesNo) {
  if (yesNo === "Yes") return "The Omen Says Yes";
  if (yesNo === "No") return "The Omen Says No";
  return "The Veil Holds: Unclear";
}
