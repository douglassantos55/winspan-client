import { Command, Response, Server } from "../server";
import Button from '../components/Button';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
    server: Server
}

function MatchFound({ server }: Props) {
    const navigate = useNavigate();
    const [waiting, setWaiting] = useState(false);

    useEffect(function() {
        server.on(Response.MatchDeclined, () => navigate('/'));
    }, []);

    function accept() {
        setWaiting(true);
        server.send({ Method: Command.AcceptMatch });
    }

    function decline() {
        server.send({ Method: Command.DeclineMatch });
    }

    return (
        <>
            <h1>Match found</h1>

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
