import styles from "./BirdFeeder.module.css";
import Food from "../../components/Food";
import { FoodType } from "../../types";

function BirdFeeder() {
    return (
        <div className={styles.container}>
            <Food type={FoodType.Fish} />
            <Food type={FoodType.Seed} />
            <Food type={FoodType.Fruit} />
            <Food type={FoodType.Fish} />
            <Food type={FoodType.Rodent} />
        </div>
    );
}

export default BirdFeeder;
