import Card from "../../components/Card";
import { Bird } from "../../types";
import styles from "./BoardSlot.module.css";

type Props = {
    icon: string;
    amount: number;
    resource: string;
    disabled: boolean;
    bird: Bird | null;
    onClick?: () => void;
}

function BoardSlot({ bird, icon, amount, resource, disabled, onClick }: Props) {
    if (bird != null) {
        return (
            <div className={styles.slot} data-testid="slot">
                <Card
                    bird={bird}
                    onClick={onClick}
                    disabled={disabled}
                    data-testid="row-bird"
                />
            </div>
        );
    }

    return (
        <div className={styles.slot} data-testid="slot">
            <img className={styles.icon} src={icon} alt="" />

            <div className={styles.resources}>
                {[...Array(amount)].map((_: number, idx: number) =>
                    <img className={styles.resource} key={idx} src={resource} alt="" data-testid="resource" />)}
            </div>
        </div>
    );
}

export default BoardSlot;
