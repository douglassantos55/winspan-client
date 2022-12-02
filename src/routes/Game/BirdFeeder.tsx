import styles from "./BirdFeeder.module.css";
import Food from "../../components/Food";
import { FoodType } from "../../types";

type Props = {
    food: Partial<Record<FoodType, number>>;
}


function BirdFeeder({ food }: Props) {
    return (
        <div className={styles.container}>
            {Object.keys(food).map(function(type: string) {
                const elements = [];
                const foodType: FoodType = parseInt(type);
                const qty = food[foodType] || 0;

                for (let i = 0; i < qty; i++) {
                    elements.push(
                        <Food
                            key={`${type}_${i}`}
                            type={foodType}
                            data-testid="food"
                        />
                    );
                }

                return elements;
            })}
        </div>
    );
}

export default BirdFeeder;
