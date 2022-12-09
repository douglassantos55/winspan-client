import { createBrowserRouter } from "react-router-dom";

import server from "./server";
import Queue from "./routes/Home";
import Game from "./routes/Game";
import Play from "./routes/Game/Play";
import MatchFound from "./routes/MatchFound";
import InitialResources from "./routes/Game/InitialResources";
import ParamProvider from "./components/ParamProvider";

export default createBrowserRouter([
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
                path: "initial-resources",
                element: <InitialResources server={server} />,
            },
            {
                path: "play/:player",
                element: <ParamProvider>
                    {(props) => <Play player={props.player} server={server} />}
                </ParamProvider>,
            }
        ],
    }
]);
