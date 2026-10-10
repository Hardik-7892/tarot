import Gloss from "../../components/Gloss";

export const metadata = {
  title: "Learn Tarot · Tarot",
  description: "History, suits, elements, upright vs reversed, spreads, and reading ethics.",
};

const SUITS = [
  { name: "Wands", glyph: "▲", element: "Fire", domain: "Action, ambition, creative spark. Ask: what wants doing?" },
  { name: "Cups", glyph: "☽", element: "Water", domain: "Emotion, bonds, intuition. Ask: what do I feel?" },
  { name: "Swords", glyph: "⚔", element: "Air", domain: "Mind, truth, conflict. Ask: what is true?" },
  { name: "Pentacles", glyph: "⛤", element: "Earth", domain: "Body, work, resources. Ask: what is real?" },
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <h1 className="mb-3 text-center font-display text-[clamp(2.2rem,5vw,3.2rem)] text-parchment">
        Learn the Craft
      </h1>
      <p className="mx-auto mb-10 max-w-[36rem] text-center leading-relaxed text-muted">
        Everything below follows the traditional Rider–Waite system, the{" "}
        <Gloss w="pellucid" /> shared language most modern decks speak.
      </p>

      <section aria-labelledby="what" className="mb-11 scroll-mt-20">
        <h2 id="what" className="mb-4 scroll-mt-20 font-display text-3xl text-goldbright">
          What Is Tarot?
        </h2>
        <p className="leading-loose">
          A deck of 78 cards used for reflection since 15th century Europe.
          First as playing cards in Milan, later as a symbolic system in
          Marseille and, decisively, in A.E. Waite &amp; Pamela Colman
          Smith&apos;s 1909 Rider–Waite deck. A reading is not fortune telling;
          it is a <Gloss w="vatic" /> conversation with your own intuition.
        </p>
      </section>

      <section aria-labelledby="anatomy" className="mb-11 scroll-mt-20">
        <h2 id="anatomy" className="mb-4 scroll-mt-20 font-display text-3xl text-goldbright">
          Anatomy of the Deck
        </h2>
        <div className="mb-6 grid gap-5 md:grid-cols-2">
          <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
            <h3 className="mb-2 font-display text-xl text-parchment">22 Major Arcana</h3>
            <p className="m-0 leading-relaxed">
              The soul&apos;s journey from The Fool (0) to The World (XXI).
              When majors dominate a spread, the question runs deep into{" "}
              <Gloss w="oneiric" /> waters. These are archetypes, not errands.
            </p>
          </article>
          <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
            <h3 className="mb-2 font-display text-xl text-parchment">56 Minor Arcana</h3>
            <p className="m-0 leading-relaxed">
              Four suits of fourteen: Ace through Ten plus Page, Knight, Queen,
              King. Pips describe situations; court cards describe people,
              roles, or ways of showing up.
            </p>
          </article>
        </div>
        <ul role="list" className="m-0 grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-4">
          {SUITS.map((s) => (
            <li key={s.name} className="rounded-[14px] border border-moon/20 p-4 text-center">
              <span aria-hidden="true" className="mb-1 block text-3xl">{s.glyph}</span>
              <strong className="text-parchment">{s.name}</strong>
              <span className="mt-1 block text-xs uppercase tracking-[0.25em] text-gold">
                {s.element}
              </span>
              <p className="mb-0 mt-2 text-sm leading-relaxed">{s.domain}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="reversals" className="mb-11 scroll-mt-20">
        <h2 id="reversals" className="mb-4 scroll-mt-20 font-display text-3xl text-goldbright">
          Upright &amp; Reversed
        </h2>
        <p className="leading-loose">
          A card dealt upside down is <em>reversed</em>. Read it as the same
          energy turned <Gloss w="tenebrous" />, delayed, blocked, or shadowed. Never as its
          flat opposite. This site draws orientation at random (~50/50) and
          shows both meanings on every card page.
        </p>
      </section>

      <section aria-labelledby="spreads" className="mb-11 scroll-mt-20">
        <h2 id="spreads" className="mb-4 scroll-mt-20 font-display text-3xl text-goldbright">
          Spreads on This Site
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
            <h3 className="mb-2 font-display text-xl text-parchment">Daily Draw · One Card</h3>
            <p className="m-0 leading-relaxed">
              One blind pick. Read it as the day&apos;s <Gloss w="augury" />, not its verdict. Journal one line about it tonight.
            </p>
          </article>
          <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
            <h3 className="mb-2 font-display text-xl text-parchment">Past · Present · Future · Three Cards</h3>
            <p className="m-0 leading-relaxed">
              Roots, weather, trajectory. Read left to right as one sentence: where it began, where it stands, where it leans.
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="ethics" className="mb-11 scroll-mt-20">
        <h2 id="ethics" className="mb-4 scroll-mt-20 font-display text-3xl text-goldbright">
          Reading Well
        </h2>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-5 leading-loose">
          <li>Ask open questions: “What should I understand about…?” beats “Will I…?”</li>
          <li>Never read for health, legal, or third party outcomes as fact.</li>
          <li>One draw per question. Redrawing until you like the answer is called “shopping”.</li>
          <li>End every reading with one concrete, kind action.</li>
        </ul>
      </section>
    </div>
  );
}
