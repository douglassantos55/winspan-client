import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Progress from "../../components/Progress";
import { Payload, Response, Server } from "../../server";
import BirdFeeder from "./BirdFeeder";
import BirdTray from "./BirdTray";
import Board from "./Board";
import Hand from "./Hand";
import styles from "./Play.module.css";

type Props = {
    server: Server;
}

function Play({ server }: Props) {
    const { state } = useLocation();

    const [turn, setTurn] = useState(0);
    const [maxTurns, setMaxTurns] = useState(state.MaxTurns);

    const [round, setRound] = useState(state.Round);

    const [current, setCurrent] = useState(state.Current);
    const [players, setPlayers] = useState(state.Players);

    useEffect(function() {
        server.on(Response.StartTurn, function(payload: Payload) {
            setTurn(payload.Turn);
            setCurrent(payload.Player);
        });

        server.on(Response.WaitTurn, function(payload: Payload) {
            setCurrent(payload.Player);
        });

        server.on(Response.RoundStarted, function(payload: Payload) {
            setTurn(1);
            setRound(payload.Round);
            setMaxTurns(payload.Turns);
            setPlayers(payload.Players)
        });
    }, [server]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.round}>Round {round}</span>

                <div className={styles.players}>
                    {players.map(function(player: any) {
                        let className = styles.player;
                        if (player.ID == current) {
                            className += " " + styles.current;
                        }
                        return (
                            <div key={player.ID} className={className} data-testid="player">
                                {player.ID}
                            </div>
                        );
                    })}
                </div>

                <span className={styles.turn}>Turn {turn}/{maxTurns}</span>
            </div>

            <Progress duration={state.Duration} />

            <div className={styles.main}>
                <Board rows={state.Board} />

                <div className={styles.sidebar}>
                    <BirdTray birds={state.BirdTray} />
                    <BirdFeeder food={state.BirdFeeder} />
                </div>
            </div>

            <div className={styles.footer}>
                <Hand birds={state.Birds} />
            </div>
        </div>
    );
}

export default Play;
