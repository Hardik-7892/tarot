import Link from "next/link";
import { MAJOR_ARCANA } from "../lib/cards";
import TarotCard from "../components/TarotCard";
import Gloss from "../components/Gloss";

const btnBase =
  "rounded-full px-8 py-3 font-display text-lg font-bold tracking-wide no-underline transition hover:-translate-y-0.5";

export default function Home() {
  const featured = MAJOR_ARCANA.slice(0, 3);

  return (
    <div className="mx-auto max-w-[1080px] px-6 pb-16">
      {/* Hero. The thesis: the deck lies facedown until you choose */}
      <section aria-labelledby="hero-title" className="px-0 pb-12 pt-[4.5rem] text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.32em] text-gold">
          Seventy-eight cards · one <Gloss w="liminal" /> question
        </p>
        <h1
          id="hero-title"
          className="mb-5 font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[1.05] text-parchment"
        >
          The Cards Lie Facedown.
          <span className="italic text-goldbright"> Your Move.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-[38rem] text-lg leading-relaxed">
          Shuffle the deck, choose blind, and turn the card yourself. A small{" "}
          <Gloss w="sortilege" /> with traditional meanings, upright &amp; reversed.
          No accounts, no noise, only the <Gloss w="susurrus" /> of the shuffle.
        </p>
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/daily"
            className={`${btnBase} bg-linear-to-b from-goldbright to-gold text-[#14100a] shadow-[0_6px_24px_rgba(212,175,55,0.3)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.45)]`}
          >
            Draw Today&apos;s Card
          </Link>
          <Link
            href="/cards"
            className="rounded-full border border-gold/55 px-8 py-3 font-display text-lg font-bold tracking-wide text-parchment no-underline transition hover:-translate-y-0.5 hover:border-goldbright hover:text-goldbright hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            Explore the Deck
          </Link>
        </div>
        <div aria-hidden="true" className="flex flex-wrap justify-center gap-5">
          {featured.map((c) => (
            <TarotCard key={c.id} card={c} startFlipped={false} size="sm" interactive={false} />
          ))}
        </div>
      </section>

      <div aria-hidden="true" className="py-4 text-center indent-[0.6em] tracking-[0.6em] text-gold opacity-70">
        ☽ ☾ ☽
      </div>

      {/* Basics */}
      <section aria-labelledby="basics-title" className="py-10">
        <h2 id="basics-title" className="mb-7 scroll-mt-20 text-center font-display text-3xl text-parchment">
          How Tarot Works
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
            <h3 className="mb-2 font-display text-xl text-goldbright">22 Major Arcana</h3>
            <p className="mb-4 leading-relaxed">
              Life&apos;s great themes, from The Fool&apos;s first step to The World&apos;s completion. The <Gloss w="numinous" /> archetypes, oldest of the deck.
            </p>
            <Link href="/cards" className="font-semibold text-moon hover:text-goldbright">
              Meet the Majors →
            </Link>
          </article>
          <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
            <h3 className="mb-2 font-display text-xl text-goldbright">56 Minor Arcana</h3>
            <p className="mb-4 leading-relaxed">
              Daily texture in four suits: Wands of fire, Cups of water, Swords of air, Pentacles of earth, the <Gloss w="evanescent" /> weather of ordinary days.
            </p>
            <Link href="/cards" className="font-semibold text-moon hover:text-goldbright">
              Meet the Minors →
            </Link>
          </article>
          <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
            <h3 className="mb-2 font-display text-xl text-goldbright">Upright &amp; Reversed</h3>
            <p className="mb-4 leading-relaxed">
              Every card turns two faces. The <Gloss w="tenebrous" /> reverse shades the meaning. It never erases it.
            </p>
            <Link href="/learn" className="font-semibold text-moon hover:text-goldbright">
              Learn to read →
            </Link>
          </article>
        </div>
      </section>

      <div aria-hidden="true" className="py-4 text-center indent-[0.6em] tracking-[0.6em] text-gold opacity-70">
        ✧ ✦ ✧
      </div>

      {/* Paths */}
      <section aria-labelledby="paths-title" className="py-10">
        <h2 id="paths-title" className="mb-7 scroll-mt-20 text-center font-display text-3xl text-parchment">
          Choose Your Path
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
            <h3 className="mb-2 font-display text-xl text-goldbright">Daily Draw</h3>
            <p className="mb-4 leading-relaxed">
              One blind pick, every visit. A small mirror for the day ahead, drawn from the <Gloss w="aleatory" /> deep.
            </p>
            <Link href="/daily" className="font-semibold text-moon hover:text-goldbright">
              Draw a card →
            </Link>
          </article>
          <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
            <h3 className="mb-2 font-display text-xl text-goldbright">Past · Present · Future</h3>
            <p className="mb-4 leading-relaxed">
              Three blind picks from the fan: roots, weather, and trajectory across <Gloss w="liminal" /> time.
            </p>
            <Link href="/spread" className="font-semibold text-moon hover:text-goldbright">
              Cast the spread →
            </Link>
          </article>
          <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
            <h3 className="mb-2 font-display text-xl text-goldbright">Yes / No Oracle</h3>
            <p className="mb-4 leading-relaxed">
              Pose a question that thirsts for yes or no. One card, one <Gloss w="augury" />.
            </p>
            <Link href="/yes-no" className="font-semibold text-moon hover:text-goldbright">
              Consult the oracle →
            </Link>
          </article>
          <article className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6">
            <h3 className="mb-2 font-display text-xl text-goldbright">Study the Craft</h3>
            <p className="mb-4 leading-relaxed">
              History, suits, elements, spreads, and reading ethics, from <Gloss w="oneiromancy" /> to conduct.
            </p>
            <Link href="/learn" className="font-semibold text-moon hover:text-goldbright">
              Open the grimoire →
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}
