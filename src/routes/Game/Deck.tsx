import { useContext } from "react";
import styles from "./Deck.module.css";
import { Command, Server } from "../../server";
import { GameState } from "../../types";
import { GameContext } from "./Play";
import card from "../../assets/bird-card-back.webp";

type Props = {
    server: Server
}

function Deck({ server }: Props) {
    const { state } = useContext(GameContext);

    function draw() {
        if (state === GameState.Idle) {
            server.send({ Method: Command.DrawFromDeck });
        }
    }

    return (
        <div className={styles.container} onClick={draw} data-testid="deck">
            <img className={styles.card} src={card} alt="deck" />
            <img className={styles.card} src={card} alt="deck" />
            <img className={styles.card} src={card} alt="deck" />
        </div>
    );
}

export default Deck;
