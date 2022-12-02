import Card from "../../components/Card";
import { Bird } from "../../types";
import styles from "./BoardSlot.module.css";

type Props = {
    icon: string;
    amount: number;
    resource: string;
    bird: Bird | null;
}

function BoardSlot({ bird, icon, amount, resource }: Props) {
    if (bird != null) {
        return (
            <div className={styles.slot} data-testid="slot">
                <Card bird={bird} />
            </div>
        );
    }

    return (
        <div className={styles.slot} data-testid="slot">
            <img className={styles.icon} src={icon} />

            <div className={styles.resources}>
                {[...Array(amount)].map((_: number, idx: number) =>
                    <img key={idx} src={resource} data-testid="resource" />)}
            </div>
        </div>
    );
}

export default BoardSlot;
