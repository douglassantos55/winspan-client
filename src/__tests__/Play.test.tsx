import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Play from "../routes/Game/Play";
import { ServerImpl } from "../server";
import _fakeSocket from "./_fakeSocket";

describe("Play", function() {
    const server = new ServerImpl(_fakeSocket);

    it("displays current round", function() {
        const state = {
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
});
