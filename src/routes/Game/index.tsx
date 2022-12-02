import { Outlet } from "react-router-dom";
import { Server } from "../../server";

type Props = {
    server: Server;
}

function Game({ server }: Props) {
    return <Outlet />;
}

export default Game;
