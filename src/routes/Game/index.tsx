import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Server } from "../../server";
import InitialResources from "./InitialResources";

type Props = {
    server: Server;
}

function Game({ server }: Props) {
    const { state } = useLocation();
    const [currState, _] = useState('InitialResources');

    const STATES: Record<string, JSX.Element> = {
        InitialResources: <InitialResources server={server} birds={state.Birds} food={state.Food} timer={state.Time} />,
    };

    return STATES[currState];
}

export default Game;
