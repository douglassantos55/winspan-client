import { Bird } from "../types";
import styles from "./Card.module.css";

type Props = {
    bird: Bird;
    disabled: boolean;
    onClick: () => void;
}

function Card({ bird, ...props }: Props) {
    return (
        <div className={styles.container} {...props}>
            <figure className={styles.imageContainer}>
                <img src="http://placeimg.com/100/300/any" className={styles.image} alt={bird.Name} />
            </figure>
            <h2 className={styles.name}>{bird.Name}</h2>
        </div>
    );
}

export default Card;
