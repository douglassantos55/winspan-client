import { createHashRouter } from "react-router-dom";
import Queue from "./routes/Home";

export default createHashRouter([
    {
        path: "/",
        element: <Queue />,
    },
]);
