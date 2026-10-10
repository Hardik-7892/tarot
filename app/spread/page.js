import DeckFan from "../../components/DeckFan";
import Gloss from "../../components/Gloss";

export const metadata = {
  title: "Threefold Spread · Tarot",
  description: "Past, present, future: pick three blind cards from the shuffled fan.",
};

export default function SpreadPage() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-12 text-center">
      <h1 className="mb-3 font-display text-[clamp(2.2rem,5vw,3.2rem)] text-parchment">
        Past · Present · Future
      </h1>
      <p className="mx-auto mb-10 max-w-[38rem] leading-relaxed text-muted">
        Hold a question lightly in mind. Choose three cards lying facedown, in
        order: first for the past, second for the present, third for the future, still{" "}
        <Gloss w="quiescent" /> and unformed.
      </p>
      <DeckFan
        pickCount={3}
        labels={["Past", "Present", "Future"]}
        spreadId="past-present-future"
        title="Three-card spread"
      />
    </div>
  );
}
