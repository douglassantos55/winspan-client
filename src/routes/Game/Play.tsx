import { createContext, Reducer, useEffect, useReducer } from "react";
import Button from "../../components/Button";
import PlayerPortrait from "../../components/PlayerPortrait";
import Progress from "../../components/Progress";
import StateInfo from "../../components/GameState";
import { Command, Payload, Response, Server } from "../../server";
import { Bird, Habitat, FoodType, GameState, Game } from "../../types";
import BirdFeeder from "./BirdFeeder";
import BirdTray from "./BirdTray";
import Board from "./Board";
import Deck from "./Deck";
import Food from "./Food";
import Hand from "./Hand";
import styles from "./Play.module.css";
import useTimer from "../../hooks/useTimer";

type Props = {
    server: Server;
    player?: string;
}

const defaultValue = {
    player: "",
    round: 1,
    current: "",
    maxTurns: 9,
    birdTray: [],
    players: [],
    birdFeeder: {},
    timeLeft: 60,
    turnDuration: 60,
    state: GameState.Loading,
    view: {
        ID: "",
        birds: [],
        board: {
            [Habitat.Forest]: [null, null, null, null, null],
            [Habitat.Grassland]: [null, null, null, null, null],
            [Habitat.Wetland]: [null, null, null, null, null],
        },
        food: {},
        turn: 0,
    },
}

export const GameContext = createContext<Game>(defaultValue);

function reducer(state: Game, action: Payload) {
    switch (action.type) {
        case Response.PlayerInfo:
            return {
                ...state,
                state: action.payload.Current === state.player
                    ? GameState.Idle
                    : GameState.Waiting,
                view: {
                    ID: state.view.ID,
                    birds: action.payload.Birds,
                    board: action.payload.Board,
                    food: action.payload.Food,
                    turn: action.payload.Turn,
                },
                current: action.payload.Current,
                birdTray: action.payload.BirdTray,
                birdFeeder: action.payload.BirdFeeder,
                round: action.payload.Round,
                maxTurns: action.payload.MaxTurns,
                turnDuration: action.payload.Duration,
                timeLeft: action.payload.TimeLeft,
                players: action.payload.TurnOrder,
            };
        case Response.BirdsDrawn:
            return {
                ...state,
                state: state.player === state.current
                    ? GameState.ActivatePower
                    : state.state,
                view: state.view.ID === state.current ? {
                    ...state.view,
                    birds: [...state.view.birds, ...action.payload],
                } : state.view,
                // remove drawn birds from tray
                birdTray: state.birdTray.filter((bird: Bird) => {
                    return action.payload.findIndex(function(drawn: Bird) {
                        return bird.ID === drawn.ID;
                    }) === -1;
                }),
            };
        case Response.StartTurn:
        case Response.WaitTurn:
            return {
                ...state,
                state: action.type === Response.WaitTurn
                    ? GameState.Waiting
                    : GameState.Idle,
                view: {
                    ...state.view,
                    turn: action.payload.Turn,
                },
                current: action.payload.Current,
                birdTray: action.payload.BirdTray,
                turnDuration: action.payload.Duration,
            };
        case Response.RoundStarted:
            return {
                ...state,
                round: action.payload.Round,
                birdTray: action.payload.BirdTray,
                maxTurns: action.payload.Turns,
                players: action.payload.TurnOrder,
                view: { ...state.view, turn: 1 },
            }
        case Response.BirdPlayed:
            if (state.current !== state.view.ID) {
                return state;
            }

            const habitat = action.payload.bird.Habitat as Habitat;
            const row = [...state.view.board[habitat]];

            const index = row.findIndex((curr: Bird | null) => curr === null);
            row[index] = action.payload.bird;

            return {
                ...state,
                state: state.current === state.player
                    ? GameState.ActivatePower
                    : state.state,
                view: {
                    ...state.view,
                    birds: state.view.birds.filter((bird: Bird) => {
                        return bird.ID !== action.payload.bird.ID;
                    }),
                    board: {
                        ...state.view.board,
                        [habitat]: row,
                    }
                },
            };
        case Response.BirdsUpdated:
            if (state.view.ID !== state.current) {
                return state
            }

            const board = { ...state.view.board };
            for (const ID in action.payload) {
                const keys = Object.keys(board);
                for (let i = 0; i < keys.length; i++) {
                    const habitat = parseInt(keys[i]) as Habitat;
                    for (let i = 0; i < board[habitat].length; i++) {
                        const bird = board[habitat][i];
                        if (bird?.ID === parseInt(ID)) {
                            (board[habitat][i] as Bird).EggCount = action.payload[ID];
                        }
                    }
                }
            }

            return { ...state, board };
        case Response.FoodGained:
            const feeder = { ...state.birdFeeder };
            const curr = { ...state.view.food };

            for (const type in action.payload.food) {
                const foodType = parseInt(type) as FoodType;
                const qtyFeeder = feeder[foodType] as number;
                const qtyPlayer = curr[foodType] || 0;

                const newQtyFeeder = qtyFeeder - action.payload.food[type];
                const newQtyPlayer = qtyPlayer + action.payload.food[type];

                if (newQtyFeeder <= 0) {
                    delete feeder[foodType];
                } else {
                    feeder[foodType] = newQtyFeeder;
                }

                if (newQtyPlayer <= 0) {
                    delete curr[foodType];
                } else {
                    curr[foodType] = newQtyPlayer;
                }
            }
            return {
                ...state,
                state: state.current === state.player
                    ? GameState.ActivatePower
                    : state.state,
                birdFeeder: feeder,
                view: state.view.ID === state.current
                    ? { ...state.view, food: curr }
                    : state.view,
            };
        case "setView":
            return {
                ...state,
                view: {
                    ...state.view,
                    ID: action.payload,
                },
            };
        default:
            throw new Error("could not process action: ", action)
    };
}

function Play({ player, server }: Props) {
    const [game, dispatch] = useReducer<Reducer<Game, Payload>>(reducer, {
        ...defaultValue,
        player: player as string,
        view: {
            ID: player as string,
            birds: [],
            board: {
                [Habitat.Forest]: [null, null, null, null, null],
                [Habitat.Grassland]: [null, null, null, null, null],
                [Habitat.Wetland]: [null, null, null, null, null],
            },
            food: {},
            turn: 0,
        },
    });

    const { current, duration, reset: resetTimer } = useTimer(game.turnDuration);

    useEffect(function() {
        server.send({
            Method: Command.GetPlayerInfo,
            Params: game.view?.ID,
        })
    }, [game.view?.ID, server]);

    useEffect(function() {
        const infoId = server.on(Response.PlayerInfo, function(payload: Payload) {
            dispatch({ type: Response.PlayerInfo, payload });
            resetTimer(payload.Duration, payload.TimeLeft);
        });

        const birdsDrawnId = server.on(Response.BirdsDrawn, (payload: Bird[]) => {
            dispatch({ type: Response.BirdsDrawn, payload });
        });

        const startTurnId = server.on(Response.StartTurn, function(payload: Payload) {
            dispatch({ type: Response.StartTurn, payload: { ...payload, Current: player } });
            resetTimer(payload.Duration, payload.TimeLeft);
        });

        const waitTurnId = server.on(Response.WaitTurn, function(payload: Payload) {
            dispatch({ type: Response.WaitTurn, payload });
            resetTimer(payload.Duration, payload.TimeLeft);
        });

        const roundStartId = server.on(Response.RoundStarted, function(payload: Payload) {
            dispatch({ type: Response.RoundStarted, payload });
        });

        const birdPlayedId = server.on(Response.BirdPlayed, function(payload: Payload) {
            dispatch({ type: Response.BirdPlayed, payload });
        });

        const foodGainedId = server.on(Response.FoodGained, function(payload: Payload) {
            dispatch({ type: Response.FoodGained, payload });
        });

        const birdsUpdatedId = server.on(Response.BirdsUpdated, function(payload: Payload) {
            dispatch({ type: Response.BirdsUpdated, payload });
        });

        return function() {
            server.off(Response.PlayerInfo, [infoId]);
            server.off(Response.StartTurn, [startTurnId]);
            server.off(Response.WaitTurn, [waitTurnId]);
            server.off(Response.RoundStarted, [roundStartId]);
            server.off(Response.BirdsDrawn, [birdsDrawnId]);
            server.off(Response.BirdPlayed, [birdPlayedId]);
            server.off(Response.FoodGained, [foodGainedId]);
            server.off(Response.BirdsUpdated, [birdsUpdatedId]);
        }
    }, [server, player, resetTimer]);

    if (game.state === GameState.Loading) {
        return <p>Loading...</p>;
    }

    return (
        <GameContext.Provider value={game}>
            <div className={styles.container}>
                <StateInfo state={game.state} />

                <div className={styles.header}>
                    <span className={styles.round}>Round {game.round}</span>

                    <div className={styles.players}>
                        {game.players.map(function(curPlayer: any) {
                            return (
                                <PlayerPortrait
                                    key={curPlayer.ID}
                                    player={curPlayer}
                                    active={curPlayer.ID === game.current}
                                    highlighted={curPlayer.ID === game.view.ID}
                                    onClick={() => dispatch({ type: "setView", payload: curPlayer.ID })}
                                />
                            );
                        })}
                    </div>

                    <div className={styles.turn}>
                        <div>Turn {game.view.turn}/{game.maxTurns}</div>

                        <Button
                            data-testid="end-turn"
                            disabled={game.current !== player}
                            onClick={() => server.send({ Method: Command.EndTurn })}
                        >
                            End turn
                        </Button>
                    </div>
                </div>

                <div className={styles.header}>
                    <Progress max={duration} current={current} />
                </div>

                <div className={styles.main}>
                    <div>
                        <Board server={server} rows={game.view.board} />

                        <div className={styles.footer}>
                            <Deck server={server} />

                            <Hand server={server} birds={game.view.birds} />
                            <Food server={server} food={game.view.food} />
                        </div>
                    </div>

                    <div className={styles.sidebar}>
                        <BirdTray birds={game.birdTray} server={server} />
                        <BirdFeeder food={game.birdFeeder} server={server} />
                    </div>
                </div>

            </div>
        </GameContext.Provider>
    );
}

export default Play;
