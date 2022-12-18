import { useEffect } from "react";
import Food from "../../components/Food";
import usePayCost, { Chosen, Cost } from "../../hooks/usePayCost";
import { Command, Payload, Response, Server } from "../../server";
import { FoodMap, FoodType } from "../../types";

type Props = {
    server: Server;
    food: FoodMap;
}

export default function PlayerFood({ server, food }: Props) {
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
        const hookId = server.on(Response.PayBirdCost, function(payload: Payload) {
            setCost((curr: Cost) => ({ ...curr, ...payload }));
        });

        return function() {
            server.off(Response.PayBirdCost, [hookId]);
        }
    }, [server, setCost])

    return (
        <div>
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
