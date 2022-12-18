import { FoodType } from "../types";
import styles from "./Food.module.css";

type Props = {
    type: FoodType;
    disabled?: boolean;
    selected?: boolean;
    onClick?: () => void;
}

function Food({ type, selected, ...props }: Props) {
    let className = styles.container;
    if (selected) {
        className += ' ' + styles.selected;
    }

    const CROP = {
        [FoodType.Fish]: "147px 4px",
        [FoodType.Seed]: "201px 4px",
        [FoodType.Fruit]: "92px 6px",
        [FoodType.Rodent]: "38px 4px",
        [FoodType.Invertebrate]: "-3px 4px",
    }

    return (
        <button
        {...props}
        className={className}
        style={{backgroundPosition: CROP[type]}}>
        </button>
    );
}

export default Food;
