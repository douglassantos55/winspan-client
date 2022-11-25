import { createHashRouter } from "react-router-dom";
import Home from "./routes/Home";

export default createHashRouter([
    {
        path: "/",
        element: <Home />,
    },
]);
