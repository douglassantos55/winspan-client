import styles from './Progress.module.css';

type Props = {
    max: number;
    current: number;
}

function Progress({ max, current }: Props) {
    return (
        <div style={{ width: `${(current / max) * 100}%` }} className={styles.bar}></div>
    );
}

export default Progress;
