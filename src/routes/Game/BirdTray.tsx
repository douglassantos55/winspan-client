import styles from "./BirdTray.module.css";
import Card from "../../components/Card";
import { Bird, GameState } from "../../types";
import { Command, Payload, Response, Server } from "../../server";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "./Play";

type Props = {
    birds: Bird[];
    server: Server;
}

function BirdTray({ birds, server }: Props) {
    const birdID = useRef<number>();
    const [birdsToDraw, setBirdsToDraw] = useState<number[]>([]);
    const [selecting, setSelecting] = useState<Payload>();

    const { state } = useContext(GameContext);

    useEffect(function() {
        if (state !== GameState.Idle) {
            setBirdsToDraw([]);
            setSelecting(undefined);
        }
    }, [state]);

    useEffect(function() {
        if (birdsToDraw.length === selecting?.qty) {
            server.send({
                Method: Command.DrawFromTray,
                Params: birdsToDraw,
            });
            setBirdsToDraw([]);
        }
    }, [birdsToDraw, selecting, server]);

    const selectBird = useCallback(function(birdID: number) {
        const valid = selecting?.cards.includes(birdID);
        const unique = !birdsToDraw.includes(birdID);

        if (valid && unique) {
            setBirdsToDraw((curr: number[]) => [...curr, birdID]);
        }
    }, [selecting, birdsToDraw]);


    useEffect(function() {
        if (selecting !== undefined && birdID.current !== undefined) {
            selectBird(birdID.current);
            birdID.current = undefined;
        }
    }, [selecting, birdID, selectBird]);

    function draw(bird: number) {
        if (state === GameState.Idle) {
            if (selecting === undefined) {
                birdID.current = bird;
                server.send({ Method: Command.DrawCards });

                const hookId = server.on(Response.ChooseBirds, (payload: Payload) => {
                    setSelecting(payload);
                    server.off(Response.ChooseBirds, [hookId]);
                });
            } else {
                selectBird(bird);
            }
        }
    }

    return (
        <div className={styles.container}>
            {birds.map(function(bird: Bird) {
                return (
                    <Card
                        key={bird.ID}
                        bird={bird}
                        data-testid="tray-bird"
                        onClick={() => draw(bird.ID)}
                        disabled={state !== GameState.Idle}
                        selected={birdsToDraw.includes(bird.ID)}
                    />
                );
            })}
        </div>
    );
}

export default BirdTray;
