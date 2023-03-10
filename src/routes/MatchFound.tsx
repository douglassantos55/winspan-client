import styles from "./MatchFound.module.css";
import { Command, Payload, Response, Server } from "../server";
import Button from '../components/Button';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Progress from "../components/Progress";
import useTimer from "../hooks/useTimer";

type Props = {
    server: Server
}

function MatchFound({ server }: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [waiting, setWaiting] = useState(false);

    const { current, duration } = useTimer(location.state.time);

    useEffect(function() {
        const declinedId = server.on(Response.MatchDeclined, () => navigate('/'));
        const waitId = server.on(Response.WaitOtherPlayers, () => setWaiting(true));

        const gameStartId = server.on(Response.ChooseCards, function(payload: Payload) {
            navigate('/game/initial-resources', { state: payload, replace: true });
        });

        return function() {
            server.off(Response.MatchDeclined, [declinedId]);
            server.off(Response.WaitOtherPlayers, [waitId]);
            server.off(Response.ChooseCards, [gameStartId]);
        }
    }, [navigate, server]);

    function accept() {
        server.send({ Method: Command.AcceptMatch });
    }

    function decline() {
        server.send({ Method: Command.DeclineMatch });
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Match found</h1>
                <Progress max={duration} current={current} />

                {!waiting && (
                    <div className={styles.buttons}>
                        <Button data-testid="accept" onClick={accept}>Accept match</Button>
                        <Button data-testid="decline" onClick={decline}>Decline match</Button>
                    </div>
                )}

                {waiting && <p className={styles.wait}>Waiting for other players...</p>}
            </div>
        </div>
    );
}

export default MatchFound;
