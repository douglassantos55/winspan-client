import styles from "./BirdFeeder.module.css";
import Food from "../../components/Food";
import { FoodMap, FoodType, GameState } from "../../types";
import { Command, Response, Server } from "../../server";
import { useCallback, useContext, useEffect, useState } from "react";
import { GameContext } from "./Play";

type Props = {
    server: Server;
    food: FoodMap;
}

type Payload = {
    Amount: number;
    Available: FoodMap;
}

function BirdFeeder({ server, food }: Props) {
    const { state } = useContext(GameContext);

    const [chosen, setChosen] = useState<FoodMap>({});
    const [selecting, setSelecting] = useState<Payload>();

    const total = useCallback(function() {
        return Object.values(chosen).reduce((total: number, qty: number) => {
            return total + qty;
        }, 0);
    }, [chosen]);

    useEffect(function() {
        if (state !== GameState.Idle) {
            setChosen({});
            setSelecting(undefined);
        }
    }, [state]);

    useEffect(function() {
        if (total() === selecting?.Amount) {
            server.send({
                Method: Command.ChooseFood,
                Params: chosen,
            });

            setChosen({});
            setSelecting(undefined);
        }
    }, [chosen, total, selecting, server]);

    function selectFood(type: FoodType): void {
        setChosen(function(curr: FoodMap) {
            const qty = curr[type] || 0;
            return { ...curr, [type]: qty + 1 };
        });
    }

    function gainFood(type: FoodType) {
        if (state === GameState.Idle) {
            if (selecting === undefined) {
                server.send({ Method: Command.GainFood });

                const hookId = server.on(Response.ChooseFood, function(payload: Payload) {
                    selectFood(type);
                    setSelecting(payload);

                    server.off(Response.ChooseFood, [hookId]);
                });
            } else {
                selectFood(type);
            }
        }
    }

    return (
        <div className={styles.container}>
            {Object.keys(food).map(function(type: string) {
                const elements = [];
                const foodType: FoodType = parseInt(type);
                const qty = food[foodType] || 0;

                for (let i = 0; i < qty; i++) {
                    const chosenQty = chosen[parseInt(type) as FoodType] || 0;

                    elements.push(
                        <Food
                            key={`${type}_${i}`}
                            type={foodType}
                            data-testid="feeder-food"
                            onClick={() => gainFood(foodType)}
                            disabled={state !== GameState.Idle || i < chosenQty}
                        />
                    );
                }

                return elements;
            })}
        </div>
    );
}

export default BirdFeeder;
