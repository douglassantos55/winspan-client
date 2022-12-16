import { Bird } from "../types";
import styles from "./Card.module.css";

type Props = {
    bird: Bird;
    disabled?: boolean;
    selected?: boolean;
    onClick?: () => void;
}

function Card({ bird, selected, ...props }: Props) {
    let className = styles.container;
    if (selected) {
        className += " " + styles.selected;
    }

    return (
        <div className={className} {...props}>
            <figure className={styles.imageContainer}>
                <img
                    src={`https://picsum.photos/100/300?rand=${bird.ID}`}
                    className={styles.image}
                    alt={bird.Name}
                />
            </figure>

            <h2 className={styles.name}>{bird.Name}</h2>
            <div>{bird.Habitat}</div>
            <span>{bird.EggCount} / {bird.EggLimit}</span>
        </div>
    );
}

export default Card;
