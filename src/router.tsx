import { createHashRouter } from "react-router-dom";
import Game from "./routes/Game";
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
        element: <Game />,
    }
]);
