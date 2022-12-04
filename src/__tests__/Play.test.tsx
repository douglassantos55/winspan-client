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
            BirdTray: [],
            BirdFeeder: {},
            Players: [{ ID: "1" }, { ID: "2" }, { ID: "3" }, { ID: "4" }],
        };

        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <Play server={server} />
        </MemoryRouter>);

        expect(el.queryAllByTestId('player')).toHaveLength(4);
    });
});
