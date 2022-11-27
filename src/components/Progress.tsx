import styles from './Progress.module.css';
import { useEffect, useState } from "react";

type Props = {
    duration: number;
}

function Progress(props: Props) {
    const [current, setCurrent] = useState(props.duration);

    useEffect(function() {
        setCurrent((curr: number) => curr - 1);
        const interval = setInterval(function() {
            setCurrent((curr: number) => curr - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ width: `${(current / props.duration) * 100}%` }} className={styles.bar}></div>
    );
}

export default Progress;
