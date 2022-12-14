import { createContext, Reducer, useEffect, useReducer } from "react";
import Button from "../../components/Button";
import PlayerPortrait from "../../components/PlayerPortrait";
import Progress from "../../components/Progress";
import { Command, Payload, Response, Server } from "../../server";
import { Bird, Board as BoardType, Habitat, FoodMap, FoodType } from "../../types";
import BirdFeeder from "./BirdFeeder";
import BirdTray from "./BirdTray";
import Board from "./Board";
import Deck from "./Deck";
import Food from "./Food";
import Hand from "./Hand";
import styles from "./Play.module.css";

type Props = {
    server: Server;
    player?: string;
}

enum GameState {
    Idle,
    Waiting,
    Loading,
}

type Player = {
    ID: string;
    birds: Bird[];
    board: BoardType;
    food: FoodMap;
    turn: number;
}

type Game = {
    state: GameState;
    current: string;
    view: Player;
    birdTray: Bird[];
    birdFeeder: FoodMap;
    round: number;
    maxTurns: number;
    turnDuration: number;
    players: Player[];
}

const defaultValue = {
    round: 1,
    current: "",
    maxTurns: 9,
    birdTray: [],
    players: [],
    birdFeeder: {},
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

const GameContext = createContext<Game>(defaultValue);

function reducer(state: Game, action: Payload) {
    switch (action.type) {
        case Response.PlayerInfo:
            return {
                state: action.payload.Current === state.current ? GameState.Idle : GameState.Waiting,
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
                players: action.payload.TurnOrder,
            };
        case Response.BirdsDrawn:
            return {
                ...state,
                view: {
                    ...state.view,
                    birds: [...state.view.birds, ...action.payload],
                },
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
                view: {
                    ...state.view,
                    turn: action.payload.Turn,
                },
                current: action.payload.Current,
                turnDuration: action.payload.Duration,
            };
        case Response.RoundStarted:
            return {
                ...state,
                round: action.payload.Round,
                maxTurns: action.payload.Turns,
                players: action.payload.TurnOrder,
                view: { ...state.view, turn: 1 },
            }
        case Response.BirdPlayed:
            const habitat = action.payload.bird.Habitat as Habitat;

            return {
                ...state,
                view: {
                    ...state.view,
                    birds: state.view.birds.filter((bird: Bird) => {
                        return bird.ID !== action.payload.bird.ID;
                    }),
                    board: {
                        ...state.view.board,
                        [habitat]: [
                            ...state.view.board[habitat],
                            action.payload.bird,
                        ],
                    }
                },
            };

        case Response.FoodGained:
            const curr = state.birdFeeder;
            for (const type in action.payload.food) {
                const foodType = parseInt(type) as FoodType;
                const qty = curr[foodType] as number;
                const newQty = qty - action.payload.food[type];

                if (newQty <= 0) {
                    delete curr[foodType];
                } else {
                    curr[foodType] = newQty;
                }
            }
            return { ...state, birdFeeder: curr };
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

    useEffect(function() {
        server.send({
            Method: Command.GetPlayerInfo,
            Params: game.view?.ID,
        })
    }, [game.view?.ID, server]);

    useEffect(function() {
        const infoId = server.on(Response.PlayerInfo, function(payload: Payload) {
            dispatch({ type: Response.PlayerInfo, payload: { ...payload, Player: player } });
        });

        const birdsDrawnId = server.on(Response.BirdsDrawn, (payload: Bird[]) => {
            dispatch({ type: Response.BirdsDrawn, payload });
        });

        const startTurnId = server.on(Response.StartTurn, function(payload: Payload) {
            dispatch({ type: Response.StartTurn, payload: { ...payload, Current: player } });
        });

        const waitTurnId = server.on(Response.WaitTurn, function(payload: Payload) {
            dispatch({ type: Response.WaitTurn, payload });
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

        return function() {
            server.off(Response.PlayerInfo, [infoId]);
            server.off(Response.StartTurn, [startTurnId]);
            server.off(Response.WaitTurn, [waitTurnId]);
            server.off(Response.RoundStarted, [roundStartId]);
            server.off(Response.BirdsDrawn, [birdsDrawnId]);
            server.off(Response.BirdPlayed, [birdPlayedId]);
            server.off(Response.FoodGained, [foodGainedId]);
        }
    }, [server, player]);


    if (game.state === GameState.Loading) {
        return <p>Loading...</p>;
    }

    return (
        <GameContext.Provider value={game}>
            <div className={styles.container}>
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

                <Progress duration={game.turnDuration} />

                <div className={styles.main}>
                    <Board server={server} rows={game.view.board} />

                    <div className={styles.sidebar}>
                        <BirdTray birds={game.birdTray} server={server} />
                        <BirdFeeder food={game.birdFeeder} server={server} />
                    </div>
                </div>

                <div className={styles.footer}>
                    <Hand server={server} birds={game.view.birds} />
                    <Food server={server} food={game.view.food} />
                    <Deck server={server} />
                </div>
            </div>
        </GameContext.Provider>
    );
}

export default Play;
