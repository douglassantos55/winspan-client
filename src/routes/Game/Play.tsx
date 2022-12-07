import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Progress from "../../components/Progress";
import { Command, Payload, Response, Server } from "../../server";
import { Bird, FoodType, Habitat } from "../../types";
import BirdFeeder from "./BirdFeeder";
import BirdTray from "./BirdTray";
import Board from "./Board";
import Hand from "./Hand";
import styles from "./Play.module.css";

type Props = {
    server: Server;
}

function Play({ server }: Props) {
    const { player } = useParams();

    const [birds, setBirds] = useState<Bird[]>([]);
    const [birdTray, setBirdTray] = useState<Bird[]>([]);
    const [birdFeeder, setBirdFeeder] = useState<Partial<Record<FoodType, number>>>({});
    const [board, setBoard] = useState<null | Partial<Record<Habitat, Array<Bird | null>>>>(null);

    const [turn, setTurn] = useState<number>(0);
    const [round, setRound] = useState<number>(0);
    const [current, setCurrent] = useState<string>("");
    const [maxTurns, setMaxTurns] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [turnOrder, setTurnOrder] = useState([]);

    useEffect(function() {
        server.send({
            Method: Command.GetPlayerInfo,
            Params: player
        })
    }, [player, server]);

    useEffect(function() {
        server.on(Response.PlayerInfo, function(payload: Payload) {
            setTurn(payload.Turn);
            setRound(payload.Round);
            setCurrent(payload.Current);
            setMaxTurns(payload.MaxTurns);
            setDuration(payload.Duration);
            setTurnOrder(payload.TurnOrder);

            setBirds(payload.Birds);
            setBirdTray(payload.BirdTray);
            setBirdFeeder(payload.BirdFeeder);
            setBoard(payload.Board);
        });

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
            setTurnOrder(payload.Players)
        });
    }, [server]);

    if (board === null) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.round}>Round {round}</span>

                <div className={styles.players}>
                    {turnOrder.map(function(player: any) {
                        let className = styles.player;
                        if (player.ID === current) {
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

            <Progress duration={duration} />

            <div className={styles.main}>
                <Board rows={board} />

                <div className={styles.sidebar}>
                    <BirdTray birds={birdTray} />
                    <BirdFeeder food={birdFeeder} />
                </div>
            </div>

            <div className={styles.footer}>
                <Hand birds={birds} />
            </div>
        </div>
    );
}

export default Play;
