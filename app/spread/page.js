import DeckFan from "../../components/DeckFan";
import Gloss from "../../components/Gloss";
import styles from "../daily/draw.module.css";

export const metadata = {
  title: "Threefold Spread · Tarot",
  description: "Past, present, future: pick three blind cards from the shuffled fan.",
};

export default function SpreadPage() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Past · Present · Future</h1>
      <p className={styles.lede}>
        Hold a question lightly in mind. Choose three cards lying facedown, in
        order: first for the past, second for the present, third for the future, still{" "}
        <Gloss w="quiescent" /> and unformed.
      </p>
      <DeckFan pickCount={3} title="Three-card spread" />
    </div>
  );
}
