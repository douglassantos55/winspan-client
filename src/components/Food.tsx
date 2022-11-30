import { FoodType } from "../types";
import styles from "./Food.module.css";

type Props = {
    type: FoodType;
    disabled: boolean;
    onClick: () => void;
}

function Food(props: Props) {
    return (
        <div {...props} className={styles.container}>
            {props.type}
        </div>
    );
}

export default Food;
