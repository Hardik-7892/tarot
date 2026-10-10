import { notFound } from "next/navigation";
import DeckFan from "../../../components/DeckFan";
import { SPREAD_PAGE_IDS, getSpread } from "../../../lib/spreads";

export function generateStaticParams() {
  return SPREAD_PAGE_IDS.map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const spread = getSpread(id);
  if (!spread) return { title: "Spread Not Found · Tarot" };
  return {
    title: `${spread.title} · Tarot`,
    description: spread.description,
  };
}

export default async function SpreadDetail({ params }) {
  const { id } = await params;
  const spread = getSpread(id);
  if (!spread || !SPREAD_PAGE_IDS.includes(id)) notFound();

  return (
    <div className="mx-auto max-w-[960px] px-6 py-12 text-center">
      <h1 className="mb-3 font-display text-[clamp(2.2rem,5vw,3.2rem)] text-parchment">
        {spread.title}
      </h1>
      <p className="mx-auto mb-2 max-w-[38rem] leading-relaxed text-muted">
        {spread.description}
      </p>
      <p className="mx-auto mb-10 max-w-[38rem] text-sm uppercase tracking-[0.2em] text-gold">
        {spread.pickCount} {spread.pickCount === 1 ? "card" : "cards"} · drawn blind
      </p>
      <DeckFan
        pickCount={spread.pickCount}
        labels={spread.labels}
        spreadId={spread.id}
        title={spread.title}
        verdict={spread.verdict}
        intentPrompt={spread.intentPrompt}
      />
    </div>
  );
}
