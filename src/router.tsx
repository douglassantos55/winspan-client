import { createHashRouter } from "react-router-dom";
import Game from "./routes/Game";
import InitialResources from "./routes/Game/InitialResources";
import Queue from "./routes/Home";
import MatchFound from "./routes/MatchFound";
import server from "./server";

export default createHashRouter([
    {
        path: "/",
        index: true,
        element: <Queue server={server} />,
    },
    {
        path: "/match-found",
        element: <MatchFound server={server} />,
    },
    {
        path: "/game",
        element: <Game server={server} />,
        children: [
            {
                path: "/initial-resources",
                element: <InitialResources server={server} />,
            },
        ],
    }
]);
