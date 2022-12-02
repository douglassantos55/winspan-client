import styles from "./BoardAction.module.css";

type Props = {
    name: string;
    icon: string;
    description?: string;
}

function BoardAction({ icon, name, description }: Props) {
    return (
        <div className={styles.container}>
            <img className={styles.icon} src={icon} />

            <div className={styles.info}>
                <span className={styles.name}>{name}</span>
                <span className={styles.description}>{description}</span>
            </div>
        </div>
    );
}

export default BoardAction;
