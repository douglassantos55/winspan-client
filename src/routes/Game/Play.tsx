import BirdFeeder from "./BirdFeeder";
import BirdTray from "./BirdTray";
import Board from "./Board";
import Hand from "./Hand";
import styles from "./Play.module.css";

function Play() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.round}>Round 1</span>
                <span className={styles.points}>25 Points</span>
            </div>

            <div className={styles.main}>
                <Board />

                <div className={styles.sidebar}>
                    <BirdTray />
                    <BirdFeeder />
                </div>
            </div>

            <div className={styles.footer}>
                <Hand />
            </div>
        </div>
    );
}

export default Play;
