import styles from "./Card.module.css";

interface CardProps {
  value: string;
  suit: string;
  flipped: boolean;
}

const Card = ({ value, suit, flipped }: CardProps) => {
  return (
    <div className={`${styles.card} ${flipped ? styles.flipped : ""}`}>
      <div className={styles.front}>
        {value} {suit}
      </div>
      <div className={styles.back}></div>
    </div>
  );
};

export default Card;
