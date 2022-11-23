import { createHashRouter } from "react-router-dom";
import Home from "./Home";

export default createHashRouter([
    {
        path: "/",
        element: <Home />,
    },
]);
