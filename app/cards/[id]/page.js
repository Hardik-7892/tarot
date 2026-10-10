import Link from "next/link";
import { CARDS, byId } from "../../../lib/cards";
import TarotCard from "../../../components/TarotCard";
import Gloss from "../../../components/Gloss";
import styles from "./detail.module.css";

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
      <div className={styles.wrap}>
        <h1>Card Not Found</h1>
        <p>This card slipped back into the deck.</p>
        <Link href="/cards">Return to the Deck →</Link>
      </div>
    );
  }

  const idx = CARDS.findIndex((c) => c.id === card.id);
  const prev = CARDS[(idx - 1 + CARDS.length) % CARDS.length];
  const next = CARDS[(idx + 1) % CARDS.length];

  return (
    <div className={styles.wrap}>
      <nav aria-label="Breadcrumb" className={styles.crumb}>
        <Link href="/cards">← All Cards</Link>
      </nav>

      <header className={styles.head}>
        <h1 className={styles.title}>{card.name}</h1>
        <p className={styles.sub}>
          {card.arcana === "major"
            ? `Major Arcana · ${roman(card.number)}`
            : `${card.suit[0].toUpperCase() + card.suit.slice(1)} · ${card.element}`}
          {"  ·  "}{card.astrology}
        </p>
        <div className={styles.keywords} aria-label="Keywords">
          {card.keywords.map((k) => (
            <span key={k} className={styles.key}>{k}</span>
          ))}
        </div>
      </header>

      <div className={styles.hero}>
        <TarotCard card={card} startFlipped={true} size="lg" />
        <p className={styles.flipHint}>Select the card to turn it over. Its <Gloss w="sibylline" /> counsel awaits.</p>
      </div>

      <p className={styles.essence}>{card.essence}</p>

      <div className={styles.meanings}>
        <article className={styles.meaning}>
          <h2>Upright</h2>
          <p>{card.upright}</p>
        </article>
        <article className={styles.meaning}>
          <h2>Reversed</h2>
          <p>{card.reversed}</p>
        </article>
      </div>

      <article className={styles.deep} aria-labelledby="deep-title">
        <h2 id="deep-title">The Deeper Reading</h2>
        <p>{card.detail}</p>
      </article>

      <div className={styles.twoCol}>
        <article className={styles.note} aria-labelledby="sym-title">
          <h2 id="sym-title">Symbolism</h2>
          <p>{card.symbolism}</p>
        </article>
        <article className={styles.note} aria-labelledby="refl-title">
          <h2 id="refl-title">Sit With This</h2>
          <p>{card.reflection}</p>
        </article>
      </div>

      <dl className={styles.facts}>
        <div>
          <dt>Element</dt>
          <dd>{card.element}</dd>
        </div>
        <div>
          <dt>Astrology</dt>
          <dd>{card.astrology}</dd>
        </div>
        <div>
          <dt>Yes / No</dt>
          <dd>{card.yesNo}</dd>
        </div>
      </dl>

      <nav className={styles.pager} aria-label="More cards">
        <Link href={`/cards/${prev.id}`}>← {prev.name}</Link>
        <Link href={`/cards/${next.id}`}>{next.name} →</Link>
      </nav>
    </div>
  );
}

function roman(n) {
  const table = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
  return table[n] ?? String(n);
}
