import { useEffect, useState } from "react";
import PlayerPortrait from "../../components/PlayerPortrait";
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
    player?: string;
}

function Play({ player, server }: Props) {
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
            setCurrent(player as string);
            setDuration(payload.Duration);
        });

        server.on(Response.WaitTurn, function(payload: Payload) {
            setCurrent(payload.Current);
            setDuration(payload.Duration);
        });

        server.on(Response.RoundStarted, function(payload: Payload) {
            setTurn(1);
            setRound(payload.Round);
            setMaxTurns(payload.Turns);
            setTurnOrder(payload.TurnOrder)
        });
    }, [player, server]);

    if (board === null) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.round}>Round {round}</span>

                <div className={styles.players}>
                    {turnOrder.map(function(curPlayer: any) {
                        return (
                            <PlayerPortrait
                                key={curPlayer.ID}
                                player={curPlayer}
                                active={curPlayer.ID === current}
                                highlighted={curPlayer.ID === view}
                            />
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
