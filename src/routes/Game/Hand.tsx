import styles from "./Hand.module.css";
import Card from "../../components/Card";
import { Bird } from "../../types";

type Props = {
    birds: Bird[];
}

function Hand({ birds }: Props) {
    return (
        <div className={styles.container}>
            {birds.map(function(bird: Bird) {
                return (
                    <Card
                        key={bird.ID}
                        bird={bird}
                        data-testid="bird"
                    />
                );
            })}
        </div>
    );
}

export default Hand;
