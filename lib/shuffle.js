/**
 * Blind-draw engine: crypto-random Fisher–Yates shuffle plus an
 * upright/reversed coin flip. client-side only, no dependencies.
 */

/** Shuffle a deck of card ids. Returns a new array. */
export function shuffleDeck(ids) {
  const deck = [...ids];
  const rand = new Uint32Array(deck.length);
  crypto.getRandomValues(rand);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = rand[i] % (i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/** Coin flip for upright / reversed. */
export function drawOrientation() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % 2 === 0 ? "upright" : "reversed";
}
