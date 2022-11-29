import { useState } from "react";
import { useLocation } from "react-router-dom";
import Card, { Bird } from "../components/Card";

function Game() {
    const { state } = useLocation();
    const { birds } = state;
    const [selected, setSelected] = useState<number[]>([]);

    function toggleBird(id: number) {
        setSelected(function(actual: number[]) {
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
        <div>
            <h1>Choose which birds to keep</h1>

            {birds.map(function(bird: Bird) {
                return (
                    <Card
                        bird={bird}
                        key={bird.ID}
                        data-testid="card"
                        onClick={() => toggleBird(bird.ID)}
                        disabled={selected.includes(bird.ID)}
                    />
                );
            })}
        </div>
    );
}

export default Game;
