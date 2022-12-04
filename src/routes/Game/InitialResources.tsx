import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Food from "../../components/Food";
import Progress from "../../components/Progress";
import { Command, Response, Server } from "../../server";
import { Bird, FoodType } from "../../types";
import styles from "./InitialResources.module.css";

type Props = {
    server: Server;
}

function InitialResources({ server }: Props) {
    const { state } = useLocation();
    const availableFood = _parseFood(state.Food);

    const navigate = useNavigate();
    const [title, setTitle] = useState("Choose which birds to keep");

    const [selectedBirds, setSelectedBirds] = useState<number[]>([]);
    const [selectedFood, setSelectedFood] = useState<number[]>(availableFood);

    useEffect(function() {
        const cancelId = server.on(Response.GameCanceled, () => navigate('/'));

        const discardId = server.on(Response.DiscardFood, function(qty: number) {
            setSelectedFood([]);
            setTitle(`Choose ${qty} food to discard`);
        });

        const waitId = server.on(Response.WaitOtherPlayers, function() {
            setTitle("Waiting other players");
        });

        const startRoundId = server.on(Response.GameStarted, function(payload) {
            navigate('/game/play', { state: payload });
        });

        return function() {
            server.off(Response.DiscardFood, [discardId]);
            server.off(Response.GameCanceled, [cancelId]);
            server.off(Response.WaitOtherPlayers, [waitId]);
            server.off(Response.RoundStarted, [startRoundId]);
        }
    }, [navigate, server, selectedBirds]);

    function select() {
        if (selectedFood.length === availableFood.length) {
            server.send({
                Method: Command.ChooseBirds,
                Params: selectedBirds
            });
        } else {
            server.send({
                Method: Command.DiscardFood,
                Params: _normalizeSelectedFood()
            });
        }
    }

    function _normalizeSelectedFood(): Partial<Record<FoodType, number>> {
        const normalized: Partial<Record<FoodType, number>> = {};
        for (let i = 0; i < selectedFood.length; i++) {
            const foodType = availableFood[selectedFood[i]] as FoodType;
            const current = normalized[foodType];
            if (current === undefined) {
                normalized[foodType] = 1;
            } else {
                normalized[foodType] = current + 1;
            }
        }
        return normalized;
    }

    function toggleBird(selected: number) {
        setSelectedBirds(function(actual: number[]) {
            if (actual.includes(selected)) {
                const idx = actual.indexOf(selected);
                return [
                    ...actual.slice(0, idx),
                    ...actual.slice(idx + 1),
                ];
            }
            return [...actual, selected];
        });
    }

    function toggleFood(selected: number) {
        setSelectedFood(function(actual: number[]) {
            if (actual.includes(selected)) {
                const idx = actual.indexOf(selected);
                return [
                    ...actual.slice(0, idx),
                    ...actual.slice(idx + 1),
                ];
            } else if (actual.length < selectedBirds.length) {
                return [...actual, selected];
            }
            return actual;
        });
    }

    function _parseFood(food: Partial<Record<FoodType, number>>): FoodType[] {
        const parsed = [];
        for (const type in food) {
            const currType: FoodType = parseInt(type);
            const qty = food[currType] || 0;
            for (let i = 0; i < qty; i++) {
                parsed.push(currType);
            }
        }
        return parsed;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{title}</h1>

            <div className={styles.cardsContainer}>
                {state.Birds.map(function(bird: Bird) {
                    return (
                        <Card
                            bird={bird}
                            key={bird.ID}
                            data-testid="bird"
                            onClick={() => toggleBird(bird.ID)}
                            selected={selectedBirds.includes(bird.ID)}
                        />
                    );
                })}
            </div>

            <div className={styles.foodContainer}>
                {availableFood.map(function(type: FoodType, idx: number) {
                    return (
                        <Food
                            key={idx}
                            type={type}
                            data-testid="food"
                            onClick={() => toggleFood(idx)}
                            selected={selectedFood.includes(type)}
                            disabled={selectedFood.length === availableFood.length}
                        />
                    )
                })}
            </div>

            <div className={styles.progressContainer}>
                <Progress duration={state.Time} />
            </div>

            <Button data-testid="choose" onClick={select} disabled={selectedBirds.length === 0 || selectedFood.length === 0}>Select</Button>
        </div>
    );
}

export default InitialResources;
