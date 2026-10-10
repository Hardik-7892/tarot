import DeckFan from "../../components/DeckFan";
import Gloss from "../../components/Gloss";
import styles from "../daily/draw.module.css";

export const metadata = {
  title: "Yes / No Oracle · Tarot",
  description: "Pose a question of yes or no, shuffle, choose one blind card, and receive its omen.",
};

export default function YesNoPage() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>The Yes / No Oracle</h1>
      <p className={styles.lede}>
        Frame a question that thirsts for yes or no, then release it.
        Shuffle the deck, choose one card blind, and receive its{" "}
        <Gloss w="augury" />. Ask but once: to redraw until pleased is to
        unmake the <Gloss w="sortilege" />.
      </p>
      <DeckFan pickCount={1} title="Yes-no oracle" verdict={true} />
    </div>
  );
}
