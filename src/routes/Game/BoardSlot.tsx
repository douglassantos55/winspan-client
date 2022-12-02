import styles from "./BoardSlot.module.css";

type Props = {
    icon: string;
    amount: number;
    resource: string;
}

function BoardSlot({ icon, amount, resource }: Props) {
    return (
        <div className={styles.slot}>
            <img className={styles.icon} src={icon} />

            <div className={styles.resources}>
                {[...Array(amount)].map(() => <img src={resource} />)}
            </div>
        </div>
    );
}

export default BoardSlot;
