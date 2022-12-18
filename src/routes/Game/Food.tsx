import styles from "./Food.module.css";
import { useContext, useEffect } from "react";
import Food from "../../components/Food";
import usePayCost, { Chosen, Cost } from "../../hooks/usePayCost";
import { Command, Payload, Response, Server } from "../../server";
import { FoodMap, FoodType, GameState } from "../../types";
import { GameContext } from "./Play";

type Props = {
    server: Server;
    food: FoodMap;
}

export default function PlayerFood({ server, food }: Props) {
    const { state } = useContext(GameContext);
    const { total, cost, chosen, setCost, setChosen } = usePayCost();

    function selectFood(type: FoodType) {
        if (total() === cost.EggCost || cost.Birds.length === 0) {
            server.send({
                Method: Command.PayBirdCost,
                Params: { ...chosen, Food: [type], BirdID: cost.BirdID },
            });

            setChosen({ Food: [], Eggs: {} });
            setCost({ Food: [], Birds: [], EggCost: -1, BirdID: -1 });
        } else {
            setChosen((curr: Chosen) => ({ ...curr, Food: [type] }));
        }
    }

    useEffect(function() {
        if ([GameState.Idle, GameState.Waiting, GameState.ActivatePower].includes(state)) {
            setChosen({ Food: [], Eggs: {} });
            setCost({ Food: [], Birds: [], EggCost: -1, BirdID: -1 });
        }
    }, [state, setChosen, setCost]);


    useEffect(function() {
        const hookId = server.on(Response.PayBirdCost, function(payload: Payload) {
            setCost((curr: Cost) => ({ ...curr, ...payload }));
        });

        return function() {
            server.off(Response.PayBirdCost, [hookId]);
        }
    }, [server, setCost])

    return (
        <div className={styles.container}>
            {Object.keys(food).map(function(type: string) {
                const elements = [];
                const foodType = parseInt(type) as FoodType;
                const qty = food[foodType] || 0;

                for (let i = 0; i < qty; i++) {
                    elements.push(
                        <Food
                            type={foodType}
                            key={`${type}_${i}`}
                            data-testid="player-food"
                            onClick={() => selectFood(foodType)}
                            disabled={!cost.Food.includes(foodType)}
                        />
                    );
                }

                return elements;
            })}
        </div>
    );
}
