import styles from "./Hand.module.css";
import Card from "../../components/Card";
import { Bird } from "../../types";
import { Command, Server } from "../../server";

type Props = {
    birds: Bird[];
    server: Server;
}

function Hand({ server, birds }: Props) {
    function playBird(birdID: number) {
        server.send({
            Method: Command.PlayBird,
            Params: birdID,
        });
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
                    />
                );
            })}
        </div>
    );
}

export default Hand;
