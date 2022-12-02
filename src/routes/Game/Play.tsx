import BirdFeeder from "./BirdFeeder";
import BirdTray from "./BirdTray";
import Board from "./Board";
import Hand from "./Hand";
import styles from "./Play.module.css";

function Play() {
    const { state } = useLocation();
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.round}>Round 1</span>
                <span className={styles.points}>25 Points</span>
            </div>

            <div className={styles.main}>
                <Board rows={state.Board} />

                <div className={styles.sidebar}>
                    <BirdFeeder />
                    <BirdTray birds={state.BirdTray} />
                </div>
            </div>

            <div className={styles.footer}>
                <Hand />
            </div>
        </div>
    );
}

export default Play;
