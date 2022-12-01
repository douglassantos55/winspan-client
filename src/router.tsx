import React from "react";
import { createHashRouter } from "react-router-dom";

import server from "./server";
import Queue from "./routes/Home";
const Game = React.lazy(() => import("./routes/Game"));
const Play = React.lazy(() => import("./routes/Game/Play"));
const MatchFound = React.lazy(() => import("./routes/MatchFound"));
const InitialResources = React.lazy(() => import("./routes/Game/InitialResources"));

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
            {
                path: "/play",
                element: <Play />,
            }
        ],
    }
]);
