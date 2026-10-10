import Gloss from "../../components/Gloss";
import styles from "./learn.module.css";

export const metadata = {
  title: "Learn Tarot · Tarot",
  description: "History, suits, elements, upright vs reversed, spreads, and reading ethics.",
};

const SUITS = [
  { name: "Wands", glyph: "🜂", element: "Fire", domain: "Action, ambition, creative spark. Ask: what wants doing?" },
  { name: "Cups", glyph: "☽", element: "Water", domain: "Emotion, bonds, intuition. Ask: what do I feel?" },
  { name: "Swords", glyph: "⚔", element: "Air", domain: "Mind, truth, conflict. Ask: what is true?" },
  { name: "Pentacles", glyph: "⬟", element: "Earth", domain: "Body, work, resources. Ask: what is real?" },
];

export default function LearnPage() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Learn the Craft</h1>
      <p className={styles.lede}>
        Everything below follows the traditional Rider–Waite system, the{" "}
        <Gloss w="pellucid" /> shared language most modern decks speak.
      </p>

      <section className={styles.section} aria-labelledby="what">
        <h2 id="what">What Is Tarot?</h2>
        <p>
          A deck of 78 cards used for reflection since 15th century Europe.
          First as playing cards in Milan, later as a symbolic system in
          Marseille and, decisively, in A.E. Waite &amp; Pamela Colman
          Smith&apos;s 1909 Rider–Waite deck. A reading is not fortune telling;
          it is a <Gloss w="vatic" /> conversation with your own intuition.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="anatomy">
        <h2 id="anatomy">Anatomy of the Deck</h2>
        <div className={styles.twoCol}>
          <article>
            <h3>22 Major Arcana</h3>
            <p>
              The soul&apos;s               journey from The Fool (0) to The World (XXI).
              When majors dominate a spread, the question runs deep into{" "}
              <Gloss w="oneiric" /> waters. These are archetypes, not errands.
            </p>
          </article>
          <article>
            <h3>56 Minor Arcana</h3>
            <p>
              Four suits of fourteen: Ace through Ten plus Page, Knight, Queen,
              King. Pips describe situations; court cards describe people,
              roles, or ways of showing up.
            </p>
          </article>
        </div>
        <ul className={styles.suits} role="list">
          {SUITS.map((s) => (
            <li key={s.name}>
              <span className={styles.glyph} aria-hidden="true">{s.glyph}</span>
              <strong>{s.name}</strong>
              <span className={styles.el}>{s.element}</span>
              <p>{s.domain}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="reversals">
        <h2 id="reversals">Upright &amp; Reversed</h2>
        <p>
          A card dealt upside down is <em>reversed</em>. Read it as the same
          energy turned <Gloss w="tenebrous" />, delayed, blocked, or shadowed. Never as its
          flat opposite. This site draws orientation at random (~50/50) and
          shows both meanings on every card page.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="spreads">
        <h2 id="spreads">Spreads on This Site</h2>
        <div className={styles.twoCol}>
          <article>
            <h3>Daily Draw · One Card</h3>
            <p>One blind pick. Read it as the day&apos;s <Gloss w="augury" />, not its verdict. Journal one line about it tonight.</p>
          </article>
          <article>
            <h3>Past · Present · Future · Three Cards</h3>
            <p>Roots, weather, trajectory. Read left to right as one sentence: where it began, where it stands, where it leans.</p>
          </article>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="ethics">
        <h2 id="ethics">Reading Well</h2>
        <ul className={styles.list}>
          <li>Ask open questions: “What should I understand about…?” beats “Will I…?”</li>
          <li>Never read for health, legal, or third party outcomes as fact.</li>
          <li>One draw per question. Redrawing until you like the answer is called “shopping”.</li>
          <li>End every reading with one concrete, kind action.</li>
        </ul>
      </section>
    </div>
  );
}
