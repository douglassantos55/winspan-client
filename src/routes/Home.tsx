import styles from "./Home.module.css";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { Server, Command, Response } from "../server";

type QueueProps = {
    server: Server
}

function Queue({ server }: QueueProps) {
    const [waiting, setWaiting] = useState(false);

    useEffect(function() {
        const waitId = server.on(Response.WaitForMatch, () => setWaiting(true));
        const declineId = server.on(Response.MatchDeclined, () => setWaiting(false));

        return function() {
            server.off(Response.WaitForMatch, [waitId]);
            server.off(Response.MatchDeclined, [declineId]);
        };
    }, []);

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
