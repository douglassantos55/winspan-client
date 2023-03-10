import { act, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Play from "../routes/Game/Play";
import { Command, Response, ServerImpl } from "../server";
import { FoodType, Habitat } from "../types";
import _fakeSocket from "./_fakeSocket";

describe("Play", function() {
    const server = new ServerImpl(_fakeSocket);

    function sendPlayerInfo() {
        act(() => _fakeSocket.dispatch("test", {
            Type: Response.PlayerInfo,
            Payload: {
                Turn: 1,
                Round: 1,
                Current: "2",
                TurnOrder: [{ ID: "1" }, { ID: "2" }, { ID: "3" }, { ID: "4" }],
                MaxTurns: 8,
                Duration: 100,
                Board: {
                    [Habitat.Forest]: [{ ID: 10, EggCount: 10 }, null, null, null, null],
                    [Habitat.Grassland]: [{ ID: 20, EggCount: 0 }, null, null, null, null],
                    [Habitat.Wetland]: [{ ID: 30, EggCount: 10 }, null, null, null, null],
                },
                Food: { [FoodType.Seed]: 1, [FoodType.Fish]: 2, [FoodType.Rodent]: 1 },
                Birds: [{ ID: 1 }, { ID: 2 }, { ID: 3, EggCost: 2 }],
                BirdTray: [{ ID: 4 }, { ID: 5 }, { ID: 6 }],
                BirdFeeder: { 0: 1, 1: 2, 2: 1 },
            },
        }));
    }

    it("requests player info", function() {
        const spy = jest.spyOn(server, 'send');
        render(<MemoryRouter><Play server={server} player="1" /></MemoryRouter>);

        expect(spy).toHaveBeenCalledWith({
            Method: Command.GetPlayerInfo,
            Params: "1",
        });
    });

    it("displays current round", function() {
        const el = render(<MemoryRouter><Play player="1" server={server} /></MemoryRouter>);
        sendPlayerInfo();

        expect(el.container).toHaveTextContent('Round 1');
    });

    it("displays current turn", function() {
        const el = render(<MemoryRouter><Play player="1" server={server} /></MemoryRouter>);
        sendPlayerInfo();

        expect(el.container).toHaveTextContent('Turn 1/8');
    });

    it("displays players", function() {
        const el = render(<MemoryRouter><Play player="1" server={server} /></MemoryRouter>);
        sendPlayerInfo();

        expect(el.queryAllByTestId('player')).toHaveLength(4);
    });

    it("highlights current player", function() {
        const el = render(<MemoryRouter><Play player="1" server={server} /></MemoryRouter>);
        sendPlayerInfo();

        const players = el.queryAllByTestId('player');

        expect(players[0].classList.contains('active')).toBe(false);
        expect(players[1].classList.contains('active')).toBe(true);
        expect(players[2].classList.contains('active')).toBe(false);
        expect(players[3].classList.contains('active')).toBe(false);
    });

    it("changes turns", function() {
        const el = render(
            <MemoryRouter>
                <Play server={server} player="3" />
            </MemoryRouter >
        );

        sendPlayerInfo();

        act(() => _fakeSocket.dispatch('test', {
            Type: Response.StartTurn,
            Payload: { Duration: 100, Turn: 3, BirdTray: [] }
        }));

        const players = el.getAllByTestId('player')
        expect(el.container).toHaveTextContent("Turn 3/8");

        expect(players[0].classList.contains('active')).toBe(false);
        expect(players[1].classList.contains('active')).toBe(false);
        expect(players[2].classList.contains('active')).toBe(true);
        expect(players[3].classList.contains('active')).toBe(false);
    });

    it("changes current player", function() {
        const el = render(<MemoryRouter><Play player="1" server={server} /></MemoryRouter>);
        sendPlayerInfo();

        act(() => _fakeSocket.dispatch('test', {
            Type: Response.WaitTurn,
            Payload: { Turn: 3, Current: "4", Duration: 100, BirdTray: [] }
        }));

        const players = el.getAllByTestId('player')

        expect(players[0].classList.contains('active')).toBe(false);
        expect(players[1].classList.contains('active')).toBe(false);
        expect(players[2].classList.contains('active')).toBe(false);
        expect(players[3].classList.contains('active')).toBe(true);
    });

    it("changes rounds", function() {
        const el = render(<MemoryRouter><Play player="1" server={server} /></MemoryRouter>);
        sendPlayerInfo();

        act(() => _fakeSocket.dispatch('test', {
            Type: Response.RoundStarted,
            Payload: { TurnOrder: [], Round: 3, Turns: 6, BirdTray: [] }
        }));

        expect(el.container).toHaveTextContent("Round 3");
        expect(el.container).toHaveTextContent("Turn 1/6");
    });

    it("changes players order", function() {
        const el = render(<MemoryRouter><Play player="1" server={server} /></MemoryRouter>);
        sendPlayerInfo();

        act(() => _fakeSocket.dispatch('test', {
            Type: Response.RoundStarted,
            Payload: { Round: 4, TurnOrder: [{ ID: 2 }, { ID: 3 }], BirdTray: [] }
        }));

        const players = el.getAllByTestId('player')
        expect(players).toHaveLength(2);
    });

    it("resets turns when round starts", function() {
        const el = render(<MemoryRouter><Play player="1" server={server} /></MemoryRouter>);
        sendPlayerInfo();

        act(() => _fakeSocket.dispatch('test', {
            Type: Response.RoundStarted,
            Payload: { Turns: 4, Round: 4, TurnOrder: [{ ID: 2 }, { ID: 3 }], BirdTray: [] }
        }));

        expect(el.container).toHaveTextContent('Round 4');
        expect(el.container).toHaveTextContent('Turn 1/4');
    });

    it("switches players", function() {
        const el = render(
            <MemoryRouter>
                <Play player="1" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();

        const spy = jest.spyOn(server, "send");
        const players = el.getAllByTestId("player");

        fireEvent.click(players[0]);
        expect(spy).toHaveBeenCalledWith({ Method: Command.GetPlayerInfo, Params: "1" });

        expect(players[0].classList.contains('active')).toBe(false);
        expect(players[1].classList.contains('active')).toBe(true);
        expect(players[2].classList.contains('active')).toBe(false);
        expect(players[3].classList.contains('active')).toBe(false);

        fireEvent.click(players[1]);
        expect(spy).toHaveBeenCalledWith({ Method: Command.GetPlayerInfo, Params: "2" });

        expect(players[0].classList.contains('active')).toBe(false);
        expect(players[1].classList.contains('active')).toBe(true);
        expect(players[2].classList.contains('active')).toBe(false);
        expect(players[3].classList.contains('active')).toBe(false);

        fireEvent.click(players[2]);
        expect(spy).toHaveBeenCalledWith({ Method: Command.GetPlayerInfo, Params: "3" });

        expect(players[0].classList.contains('active')).toBe(false);
        expect(players[1].classList.contains('active')).toBe(true);
        expect(players[2].classList.contains('active')).toBe(false);
        expect(players[3].classList.contains('active')).toBe(false);

        fireEvent.click(players[3]);
        expect(spy).toHaveBeenCalledWith({ Method: Command.GetPlayerInfo, Params: "4" });

        expect(players[0].classList.contains('active')).toBe(false);
        expect(players[1].classList.contains('active')).toBe(true);
        expect(players[2].classList.contains('active')).toBe(false);
        expect(players[3].classList.contains('active')).toBe(false);
    });

    it("ends turns", function() {
        const el = render(
            <MemoryRouter>
                <Play player="2" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();

        const spy = jest.spyOn(server, "send");
        fireEvent.click(el.getByTestId("end-turn"));

        expect(spy).toHaveBeenCalledWith({
            Method: Command.EndTurn,
            Params: undefined
        });
    });

    it("draws cards from deck", function() {
        const el = render(
            <MemoryRouter>
                <Play player="2" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();
        expect(el.getAllByTestId("bird")).toHaveLength(3);

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.BirdsDrawn,
            Payload: [{ ID: 4 }, { ID: 5 }],
        }));

        expect(el.getAllByTestId("bird")).toHaveLength(5);
    });

    it("draws cards from tray", function() {
        const el = render(
            <MemoryRouter>
                <Play player="1" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();
        expect(el.getAllByTestId("bird")).toHaveLength(3);

        const players = el.getAllByTestId("player");
        fireEvent.click(players[1]);

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.BirdsDrawn,
            Payload: [{ ID: 4 }, { ID: 5 }],
        }));

        expect(el.getAllByTestId("bird")).toHaveLength(5);
    });

    it("removes drawn cards from tray", function() {
        const el = render(
            <MemoryRouter>
                <Play player="1" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();
        expect(el.getAllByTestId("tray-bird")).toHaveLength(3);

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.BirdsDrawn,
            Payload: [{ ID: 4 }, { ID: 5 }],
        }));

        expect(el.getAllByTestId("tray-bird")).toHaveLength(1);
    });

    it("removes played bird", function() {
        const el = render(
            <MemoryRouter>
                <Play player="2" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.BirdPlayed,
            Payload: {
                player: "2",
                bird: { ID: 1, Habitat: Habitat.Wetland },
            },
        }));

        expect(el.getAllByTestId("bird")).toHaveLength(2);
    });

    it("removes played bird when looking at other players board", function() {
        const el = render(
            <MemoryRouter>
                <Play player="1" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();

        const players = el.getAllByTestId("player");
        fireEvent.click(players[1]);

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.BirdPlayed,
            Payload: {
                player: "2",
                bird: { ID: 1, Habitat: Habitat.Forest },
            },
        }));

        expect(el.getAllByTestId("bird")).toHaveLength(2);
    });

    it("adds played bird on board", function() {
        const el = render(
            <MemoryRouter>
                <Play player="2" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.BirdPlayed,
            Payload: {
                player: "2",
                bird: { ID: 1, Habitat: Habitat.Forest },
            },
        }));

        const rows = el.getAllByTestId("row");
        expect(rows[0].querySelectorAll("[data-testid='row-bird']")).toHaveLength(2);
    });

    it("removes chosen food from feeder", function() {
        const el = render(
            <MemoryRouter>
                <Play player="2" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.FoodGained,
            Payload: {
                player: "2",
                food: { 0: 1, 2: 1 },
            },
        }));

        const food = el.getAllByTestId("feeder-food");
        expect(food).toHaveLength(2);
    });

    it("pays food cost", function() {
        const el = render(
            <MemoryRouter>
                <Play player="2" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();

        const hand = el.getAllByTestId("bird");

        fireEvent.click(hand[1]);

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.PayBirdCost,
            Payload: {
                BirdID: 2,
                Birds: [],
                EggCost: 0,
                Food: [FoodType.Fish, FoodType.Rodent],
            }
        }));

        const spy = jest.spyOn(server, "send");
        const food = el.getAllByTestId("player-food");

        fireEvent.click(food[3]);

        expect(spy).toHaveBeenCalledWith({
            Method: Command.PayBirdCost,
            Params: { Food: [FoodType.Rodent], Eggs: {}, BirdID: 2 },
        });
    });

    it("pays egg cost", function() {
        const el = render(
            <MemoryRouter>
                <Play player="2" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();

        const spy = jest.spyOn(server, "send");
        const birds = el.getAllByTestId("row-bird");

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.PayBirdCost,
            Payload: {
                BirdID: 3,
                Birds: [{ 10: 10 }, { 30: 10 }],
                EggCost: 1,
                Food: [],
            }
        }));

        expect(birds[0].hasAttribute("disabled")).toBe(false);
        expect(birds[1].hasAttribute("disabled")).toBe(true);
        expect(birds[2].hasAttribute("disabled")).toBe(false);

        fireEvent.click(birds[2]);

        expect(spy).toHaveBeenCalledWith({
            Method: Command.PayBirdCost,
            Params: { Food: [], Eggs: { 30: 1 }, BirdID: 3 },
        });
    });

    it("pays food and egg cost", function() {
        const el = render(
            <MemoryRouter>
                <Play player="2" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();

        const spy = jest.spyOn(server, "send");
        const birds = el.getAllByTestId("row-bird");
        const food = el.getAllByTestId("player-food");

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.PayBirdCost,
            Payload: {
                BirdID: 3,
                Birds: [{ 10: 10 }, { 30: 10 }],
                EggCost: 1,
                Food: [FoodType.Fish, FoodType.Seed],
            }
        }));

        expect(birds[0].hasAttribute("disabled")).toBe(false);
        expect(birds[1].hasAttribute("disabled")).toBe(true);
        expect(birds[2].hasAttribute("disabled")).toBe(false);

        expect(food[0].hasAttribute("disabled")).toBe(false);
        expect(food[1].hasAttribute("disabled")).toBe(false);
        expect(food[2].hasAttribute("disabled")).toBe(false);
        expect(food[3].hasAttribute("disabled")).toBe(true);

        fireEvent.click(birds[0]);
        fireEvent.click(food[0]);

        expect(spy).toHaveBeenCalledWith({
            Method: Command.PayBirdCost,
            Params: { Food: [FoodType.Seed], Eggs: { 10: 1 }, BirdID: 3 },
        });
    });

    it("updates birds", function() {
        const el = render(
            <MemoryRouter>
                <Play player="2" server={server} />
            </MemoryRouter>
        );

        sendPlayerInfo();

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.BirdsUpdated,
            Payload: { 30: 0 },
        }));

        const birds = el.getAllByTestId("row-bird");
        expect(birds[2]).toHaveTextContent("0");
    });
});
