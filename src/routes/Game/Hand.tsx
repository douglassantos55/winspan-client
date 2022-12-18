import styles from "./Hand.module.css";
import Card from "../../components/Card";
import { Bird, GameState } from "../../types";
import { Command, Server } from "../../server";
import { useContext } from "react";
import { GameContext } from "./Play";

type Props = {
    birds: Bird[];
    server: Server;
}

function Hand({ server, birds }: Props) {
    const { state, view, current } = useContext(GameContext);

    function playBird(birdID: number) {
        if (state === GameState.Idle) {
            server.send({
                Method: Command.PlayBird,
                Params: birdID,
            });
        }
    }

    return (
        <div className={styles.container}>
            {birds.map(function(bird: Bird) {
                return (
                    <Card
                        key={bird.ID}
                        bird={bird}
                        data-testid="bird"
                        onClick={() => playBird(bird.ID)}
                        disabled={state !== GameState.Idle && current !== view.ID}
                    />
                );
            })}
        </div>
    );
}

export default Hand;
