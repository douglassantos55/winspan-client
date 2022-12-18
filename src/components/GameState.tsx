import { useEffect, useState } from "react";
import { GameState } from "../types";
import styles from "./GameState.module.css";

type Props = {
    state: GameState,
}

function Helper({ state }: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(function() {
        setVisible(false);
        setTimeout(() => setVisible(true), 100);
    }, [state]);

    function getTitle() {
        switch (state) {
            case GameState.Idle:
                return "Choose one action";
            case GameState.Waiting:
                return "Waiting turn";
            case GameState.ActivatePower:
                return "Activate bird powers";
            default:
                return "No state";
        }
    }

    function getDescription() {
        switch (state) {
            case GameState.Idle:
                return "Choose a bird from the tray, draw a card from the deck or gain a food from the feeder.";
            case GameState.Waiting:
                return "Wait for the current player's turn to end before you can do anything.";
            case GameState.ActivatePower:
                return "Activate bird powers from right to left.";
            default:
                return "This is weird, no state description found.";
        }
    }

    if (!visible) {
        return null;
    }

    return (
        <div className={styles.container}>
            <span className={styles.title}>{getTitle()}</span>
            <span className={styles.description}>{getDescription()}</span>
        </div>
    );
}

export default Helper;
