import styles from "./Home.module.css";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { Server, Command, Response } from "../server";
import { useNavigate } from "react-router-dom";

type QueueProps = {
    server: Server
}

function Queue({ server }: QueueProps) {
    const navigate = useNavigate();
    const [waiting, setWaiting] = useState(false);

    useEffect(function() {
        const waitId = server.on(Response.WaitForMatch, () => setWaiting(true));
        const declineId = server.on(Response.MatchDeclined, () => setWaiting(false));
        const matchId = server.on(Response.MatchFound, (payload: any) =>
            navigate('/match-found', { state: { time: payload } })
        );

        return function() {
            server.off(Response.WaitForMatch, [waitId]);
            server.off(Response.MatchDeclined, [declineId]);
            server.off(Response.MatchFound, [matchId]);
        };
    }, [server, navigate]);

    function queue() {
        server.send({ Method: Command.QueueUp });
    }

    return (
        <div className={styles.container}>
            <Button data-testid="queue-up" text="Find match" onClick={queue} disabled={waiting} />
        </div>
    );
}

export default Queue;
