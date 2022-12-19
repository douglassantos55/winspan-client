import { act, fireEvent, render } from "@testing-library/react";
import BirdTray from "../routes/Game/BirdTray";
import { GameContext } from "../routes/Game/Play";
import { Command, Response, ServerImpl } from "../server";
import { GameState } from "../types";
import _fakeSocket from "./_fakeSocket";

describe("Bird Tray", function() {
    const server = new ServerImpl(_fakeSocket);

    it("renders birds", function() {
        const birds = [
            { ID: 1, Name: "Bird 1", Habitat: 0, EggCost: 0, EggLimit: 0, EggCount: 0 },
            { ID: 2, Name: "Bird 2", Habitat: 0, EggCost: 0, EggLimit: 0, EggCount: 0 },
        ];

        const el = render(<BirdTray birds={birds} server={server} />);
        expect(el.getAllByTestId('tray-bird')).toHaveLength(2);
    });

    it("renders no birds", function() {
        const el = render(<BirdTray birds={[]} server={server} />);
        expect(el.queryAllByTestId('tray-bird')).toHaveLength(0);
    });

    it("draws birds from tray", function() {
        const tray = [
            { ID: 1, Name: "1", Habitat: 0, EggCost: 0, EggLimit: 0, EggCount: 0 },
            { ID: 2, Name: "2", Habitat: 0, EggCost: 0, EggLimit: 0, EggCount: 0 }
        ];

        const ctx = { state: GameState.Idle };

        const el = render(
            // @ts-ignore
            <GameContext.Provider value={ctx}>
                <BirdTray birds={tray} server={server} />
            </GameContext.Provider>
        );

        const spy = jest.spyOn(server, "send");
        let birds = el.getAllByTestId("tray-bird");

        fireEvent.click(birds[1]);

        expect(spy).toHaveBeenCalledWith({
            Method: Command.DrawCards,
            Params: undefined,
        });

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.ChooseBirds,
            Payload: { qty: 2, cards: [1, 2] },
        }));

        expect(birds[0].classList.contains("selected")).toBe(false);
        expect(birds[1].classList.contains("selected")).toBe(true);
    });
});
