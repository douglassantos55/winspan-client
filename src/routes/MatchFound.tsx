import { Command, Response, Server } from "../server";
import Button from '../components/Button';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Progress from "../components/Progress";

type Props = {
    server: Server
}

function MatchFound({ server }: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [waiting, setWaiting] = useState(false);

    useEffect(function() {
        const declinedId = server.on(Response.MatchDeclined, () => navigate('/'));
        const waitId = server.on(Response.WaitOtherPlayers, () => setWaiting(true));
        const gameStartId = server.on(Response.ChooseCards, () => navigate('/game'));

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
        <>
            <h1>Match found</h1>
            <Progress duration={location.state.time} />

            {!waiting && (
                <>
                    <Button data-testid="accept" onClick={accept}>Accept match</Button>
                    <Button data-testid="decline" onClick={decline}>Decline match</Button>
                </>
            )}

            {waiting && <p>Waiting for other players...</p>}
        </>
    );
}

export default MatchFound;
