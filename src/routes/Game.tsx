import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Food from "../components/Food";
import Progress from "../components/Progress";
import { Command, Response, Server } from "../server";
import { Bird, FoodType } from "../types";
import styles from "./Game.module.css";

type Props = {
    server: Server;
}

function Game({ server }: Props) {
    const navigate = useNavigate();
    const { state } = useLocation();

    const birds: Bird[] = state.Birds;
    const food: Record<FoodType, number> = state.Food;

    const [max, setMax] = useState(0);
    const [currState, setCurrState] = useState("birds");
    const [available, setAvailable] = useState<FoodType[]>([]);

    const [selectedBirds, setSelectedBirds] = useState<number[]>([]);
    const [selectedFood, setSelectedFood] = useState<number[]>([]);

    useEffect(function() {
        const discardId = server.on(Response.DiscardFood, function(payload: number) {
            setMax(payload);
            setCurrState('food')
        });

        const cancelId = server.on(Response.GameCanceled, function() {
            navigate('/');
        });

        return function() {
            server.off(Response.DiscardFood, [discardId]);
            server.off(Response.GameCanceled, [cancelId]);
        }
    }, [server, navigate]);

    useEffect(function() {
        const arr = [];
        for (const type in food) {
            const currType: FoodType = parseInt(type);
            for (let i = 0; i < food[currType]; i++) {
                arr.push(currType);
            }
        }
        setAvailable(arr);
    }, [food]);

    function choose() {
        if (currState === "birds") {
            server.send({ Method: Command.ChooseBirds, Params: selectedBirds });
            setCurrState("food");
        } else {
            const gathered: Partial<Record<FoodType, number>> = {};
            for (let i = 0; i < selectedFood.length; i++) {
                const foodType = available[selectedFood[i]] as FoodType;
                const current = gathered[foodType];
                if (current === undefined) {
                    gathered[foodType] = 1;
                } else {
                    gathered[foodType] = current + 1;
                }
            }
            server.send({ Method: Command.DiscardFood, Params: gathered });
        }
    }

    function toggleFood(index: number) {
        setSelectedFood(function(actual: number[]) {
            if (actual.includes(index)) {
                const idx = actual.indexOf(index);
                return [
                    ...actual.slice(0, idx),
                    ...actual.slice(idx + 1),
                ];
            } else if (actual.length < max) {
                return [...actual, index];
            }
            return actual;
        });
    }

    function toggleBird(id: number) {
        setSelectedBirds(function(actual: number[]) {
            if (actual.includes(id)) {
                const idx = actual.indexOf(id);
                return [
                    ...actual.slice(0, idx),
                    ...actual.slice(idx + 1),
                ];
            }
            return [...actual, id];
        });
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{currState === "birds" ? "Choose which birds to keep" : "Choose which food to discard"}</h1>

            <div className={styles.cardsContainer}>
                {birds.map(function(bird: Bird) {
                    return (
                        <Card
                            bird={bird}
                            key={bird.ID}
                            data-testid="card"
                            onClick={() => toggleBird(bird.ID)}
                            disabled={currState === "food" || selectedBirds.includes(bird.ID)}
                        />
                    );
                })}
            </div>

            <div className={styles.foodContainer}>
                {available.map(function(type: FoodType, idx: number) {
                    return (
                        <Food
                            key={idx}
                            type={type}
                            data-testid="food"
                            onClick={() => toggleFood(idx)}
                            disabled={currState === "birds" || selectedFood.includes(idx)}
                        />
                    )
                })}
            </div>

            <div className={styles.progressContainer}>
                <Progress duration={state.Time} />
            </div>

            <Button data-testid="choose" onClick={choose}>Choose {currState}</Button>
        </div>
    );
}

export default Game;
