import { act, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Play from "../routes/Game/Play";
import { Response, ServerImpl } from "../server";
import _fakeSocket from "./_fakeSocket";

describe("Play", function() {
    const server = new ServerImpl(_fakeSocket);

    it("displays current round", function() {
        const state = {
            Round: 1,
            MaxTurns: 9,
            Duration: 100,
            Board: {},
            Current: "",
            Birds: [],
            BirdTray: [],
            BirdFeeder: {},
            Players: [],
        };

        const el = render(<MemoryRouter initialEntries={[{ state }]}><Play server={server} /></MemoryRouter>);
        expect(el.container).toHaveTextContent('Round 1');
    });

    it("displays current turn", function() {
        const state = {
            MaxTurns: 9,
            Duration: 100,
            Board: {},
            Birds: [],
            Current: "",
            BirdTray: [],
            BirdFeeder: {},
            Players: [],
        };

        const el = render(<MemoryRouter initialEntries={[{ state }]}><Play server={server} /></MemoryRouter>);
        expect(el.container).toHaveTextContent('Turn 0/9');
    });

    it("displays players", function() {
        const state = {
            MaxTurns: 9,
            Duration: 100,
            Board: {},
            Birds: [],
            Current: "",
            BirdTray: [],
            BirdFeeder: {},
            Players: [{ ID: "1" }, { ID: "2" }, { ID: "3" }, { ID: "4" }],
        };

        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <Play server={server} />
        </MemoryRouter>);

        expect(el.queryAllByTestId('player')).toHaveLength(4);
    });

    it("highlights current player", function() {
        const state = {
            MaxTurns: 9,
            Duration: 100,
            Board: {},
            Birds: [],
            BirdTray: [],
            BirdFeeder: {},
            Current: "2",
            Players: [{ ID: "1" }, { ID: "2" }],
        };

        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <Play server={server} />
        </MemoryRouter>);

        const firstPlayer = el.getAllByTestId('player')
        expect(firstPlayer[0].classList.contains('current')).toBe(false);
        expect(firstPlayer[1].classList.contains('current')).toBe(true);
    });

    it("changes turns", function() {
        const state = {
            MaxTurns: 7,
            Duration: 100,
            Board: {},
            Birds: [],
            BirdTray: [],
            BirdFeeder: {},
            Current: "1",
            Players: [{ ID: "1" }, { ID: "2" }, { ID: "3" }],
        };

        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <Play server={server} />
        </MemoryRouter>);

        act(() => _fakeSocket.dispatch('test', { Type: Response.StartTurn, Payload: { Duration: 100, Turn: 3, Player: 3 } }));
        const players = el.getAllByTestId('player')

        expect(el.container).toHaveTextContent("Turn 3/7");

        expect(players[0].classList.contains('current')).toBe(false);
        expect(players[1].classList.contains('current')).toBe(false);
        expect(players[2].classList.contains('current')).toBe(true);
    });

    it("changes current player", function() {
        const state = {
            MaxTurns: 9,
            Duration: 100,
            Board: {},
            Birds: [],
            BirdTray: [],
            BirdFeeder: {},
            Current: "1",
            Players: [{ ID: "1" }, { ID: "2" }, { ID: "3" }],
        };

        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <Play server={server} />
        </MemoryRouter>);

        act(() => _fakeSocket.dispatch('test', { Type: Response.WaitTurn, Payload: { Player: "2" } }));
        const players = el.getAllByTestId('player')

        expect(players[0].classList.contains('current')).toBe(false);
        expect(players[1].classList.contains('current')).toBe(true);
        expect(players[2].classList.contains('current')).toBe(false);
    });

    it("changes rounds", function() {
        const state = {
            MaxTurns: 9,
            Duration: 100,
            Board: {},
            Birds: [],
            BirdTray: [],
            BirdFeeder: {},
            Current: "1",
            Players: [{ ID: "1" }, { ID: "2" }, { ID: "3" }],
        };

        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <Play server={server} />
        </MemoryRouter>);

        act(() => _fakeSocket.dispatch('test', { Type: Response.RoundStarted, Payload: { Players: [], Round: 2, Turns: 7 } }));
        expect(el.container).toHaveTextContent("Round 2");
        expect(el.container).toHaveTextContent("Turn 1/7");
    });

    it("changes players order", function() {
        const state = {
            MaxTurns: 9,
            Duration: 100,
            Board: {},
            Birds: [],
            BirdTray: [],
            BirdFeeder: {},
            Current: "1",
            Players: [{ ID: "1" }, { ID: "2" }, { ID: "3" }],
        };

        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <Play server={server} />
        </MemoryRouter>);

        act(() => _fakeSocket.dispatch('test', { Type: Response.RoundStarted, Payload: { Players: [{ ID: 2 }, { ID: 3 }] } }));
        const players = el.getAllByTestId('player')

        expect(players[0]).toHaveTextContent("2");
        expect(players[1]).toHaveTextContent("3");
    });
});
