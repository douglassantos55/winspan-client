import { useEffect, useState } from "react";
import Food from "../../components/Food";
import { Command, Payload, Response, Server } from "../../server";
import { FoodMap, FoodType } from "../../types";

type Props = {
    server: Server;
    food: FoodMap;
}

export default function({ server, food }: Props) {
    const [available, setAvailable] = useState<FoodType[]>([]);

    function selectFood(type: FoodType) {
        server.send({
            Method: Command.PayBirdCost,
            Params: { food: [type] },
        });
    }

    useEffect(function() {
        const hookId = server.on(Response.PayBirdCost, function(payload: Payload) {
            setAvailable(payload.Food);
        });

        return function() {
            server.off(Response.PayBirdCost, [hookId]);
        }
    }, [server, setAvailable])

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
                            disabled={!available.includes(foodType)}
                        />
                    );
                }

                return elements;
            })}
        </div>
    );
}
