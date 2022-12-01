import { FoodType } from "../types";
import styles from "./Food.module.css";

type Props = {
    type: FoodType;
    disabled?: boolean;
    selected?: boolean;
    onClick: () => void;
}

function Food({ type, selected, ...props }: Props) {
    let className = styles.container;
    if (selected) {
        className += ' ' + styles.selected;
    }

    return (
        <button {...props} className={className}>
            {type}
        </button>
    );
}

export default Food;
