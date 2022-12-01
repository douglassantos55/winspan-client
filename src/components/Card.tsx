import { Bird } from "../types";
import styles from "./Card.module.css";

type Props = {
    bird: Bird;
    disabled?: boolean;
    selected?: boolean;
    onClick: () => void;
}

function Card({ bird, selected, ...props }: Props) {
    let className = styles.container;
    if (selected) {
        className += " selected";
    }

    return (
        <div className={className} {...props}>
            <figure className={styles.imageContainer}>
                <img src="http://placeimg.com/100/300/any" className={styles.image} alt={bird.Name} />
            </figure>
            <h2 className={styles.name}>{bird.Name}</h2>
        </div>
    );
}

export default Card;
