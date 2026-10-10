import Link from "next/link";
import { MAJOR_ARCANA } from "../lib/cards";
import TarotCard from "../components/TarotCard";
import Gloss from "../components/Gloss";
import styles from "./page.module.css";

export default function Home() {
  const featured = MAJOR_ARCANA.slice(0, 3);

  return (
    <div className={styles.page}>
      {/* Hero. The thesis: the deck lies facedown until you choose */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <p className={styles.eyebrow}>Seventy-eight cards · one <Gloss w="liminal" /> question</p>
        <h1 id="hero-title" className={styles.title}>
          The Cards Lie Facedown.
          <span className={styles.titleGold}> Your Move.</span>
        </h1>
        <p className={styles.lede}>
          Shuffle the deck, choose blind, and turn the card yourself. A small{" "}
          <Gloss w="sortilege" /> with traditional meanings, upright &amp; reversed.
          No accounts, no noise, only the <Gloss w="susurrus" /> of the shuffle.
        </p>
        <div className={styles.ctas}>
          <Link href="/daily" className={styles.primary}>
            Draw Today&apos;s Card
          </Link>
          <Link href="/cards" className={styles.secondary}>
            Explore the Deck
          </Link>
        </div>
        <div className={styles.heroCards} aria-hidden="true">
          {featured.map((c) => (
            <TarotCard key={c.id} card={c} startFlipped={false} size="sm" interactive={false} />
          ))}
        </div>
      </section>

      <div className={styles.divider} aria-hidden="true">☽ ☾ ☽</div>

      {/* Basics */}
      <section className={styles.section} aria-labelledby="basics-title">
        <h2 id="basics-title">How Tarot Works</h2>
        <div className={styles.grid3}>
          <article className={styles.card}>
            <h3>22 Major Arcana</h3>
            <p>Life&apos;s great themes, from The Fool&apos;s first step to The World&apos;s completion. The <Gloss w="numinous" /> archetypes, oldest of the deck.</p>
            <Link href="/cards">Meet the Majors →</Link>
          </article>
          <article className={styles.card}>
            <h3>56 Minor Arcana</h3>
            <p>Daily texture in four suits: Wands of fire, Cups of water, Swords of air, Pentacles of earth, the <Gloss w="evanescent" /> weather of ordinary days.</p>
            <Link href="/cards">Meet the Minors →</Link>
          </article>
          <article className={styles.card}>
            <h3>Upright &amp; Reversed</h3>
            <p>Every card turns two faces. The <Gloss w="tenebrous" /> reverse shades the meaning. It never erases it.</p>
            <Link href="/learn">Learn to read →</Link>
          </article>
        </div>
      </section>

      <div className={styles.divider} aria-hidden="true">✧ ✦ ✧</div>

      {/* Paths */}
      <section className={styles.section} aria-labelledby="paths-title">
        <h2 id="paths-title">Choose Your Path</h2>
        <div className={styles.grid3}>
          <article className={styles.card}>
            <h3>Daily Draw</h3>
            <p>One blind pick, every visit. A small mirror for the day ahead, drawn from the <Gloss w="aleatory" /> deep.</p>
            <Link href="/daily">Draw a card →</Link>
          </article>
          <article className={styles.card}>
            <h3>Past · Present · Future</h3>
            <p>Three blind picks from the fan: roots, weather, and trajectory across <Gloss w="liminal" /> time.</p>
            <Link href="/spread">Cast the spread →</Link>
          </article>
          <article className={styles.card}>
            <h3>Yes / No Oracle</h3>
            <p>Pose a question that thirsts for yes or no. One card, one <Gloss w="augury" />.</p>
            <Link href="/yes-no">Consult the oracle →</Link>
          </article>
          <article className={styles.card}>
            <h3>Study the Craft</h3>
            <p>History, suits, elements, spreads, and reading ethics, from <Gloss w="oneiromancy" /> to conduct.</p>
            <Link href="/learn">Open the grimoire →</Link>
          </article>
        </div>
      </section>
    </div>
  );
}
