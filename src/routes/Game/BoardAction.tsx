import styles from "./BoardAction.module.css";

type Props = {
    name: string;
    icon: string;
    description?: string;
}

function BoardAction({ icon, name, description }: Props) {
    return (
        <div className={styles.container}>
            <img className={styles.icon} src={icon} alt={name} />
        </div>
    );
}

export default BoardAction;
