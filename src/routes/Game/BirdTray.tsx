import styles from "./BirdTray.module.css";
import Card from "../../components/Card";

function BirdTray() {
    return (
        <div className={styles.container}>
            <Card bird={{ ID: 1, Name: "Bird 1" }} />
            <Card bird={{ ID: 2, Name: "Bird 2" }} />
            <Card bird={{ ID: 3, Name: "Bird 3" }} />
        </div>
    );
}

export default BirdTray;
