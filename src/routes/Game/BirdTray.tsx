import styles from "./BirdTray.module.css";
import Card from "../../components/Card";
import { Bird } from "../../types";

type Props = {
    birds: Bird[];
}

function BirdTray({ birds }: Props) {
    return (
        <div className={styles.container}>
            {birds.map(function(bird: Bird) {
                return <Card key={bird.ID} bird={bird} data-testid="bird" />;
            })}
        </div>
    );
}

export default BirdTray;
