import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Progress from "../../components/Progress";
import { Response, Server } from "../../server";
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

    const [round, setRound] = useState(1);
    const [points, setPoints] = useState(0);

    const [waiting, setWaiting] = useState(false);
    const [current, setCurrent] = useState(state.Current);
    const [players, setPlayers] = useState(state.Players);

    useEffect(function() {
        server.on(Response.WaitTurn, () => setWaiting(true));
        server.on(Response.StartTurn, () => setWaiting(false));
    }, [server]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.roundTurn}>
                    <span className={styles.round}>Round {round}</span>
                    <span className={styles.turn}>Turn {turn}/{maxTurns}</span>
                </div>

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

                <span className={styles.points}>{points} Points</span>
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
