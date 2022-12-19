import { fireEvent, render } from "@testing-library/react";
import Hand from "../routes/Game/Hand";
import { GameContext } from "../routes/Game/Play";
import { Command, ServerImpl } from "../server";
import { GameState } from "../types";
import _fakeSocket from "./_fakeSocket";

describe("Hand", function() {
    const server = new ServerImpl(_fakeSocket);

    it("displays cards", function() {
        const birds = [
            { ID: 1, Name: "Bird 1", Habitat: 0, EggCost: 0, EggLimit: 0, EggCount: 0 },
            { ID: 2, Name: "Bird 2", Habitat: 0, EggCost: 0, EggLimit: 0, EggCount: 0 },
            { ID: 3, Name: "Bird 3", Habitat: 0, EggCost: 0, EggLimit: 0, EggCount: 0 },
        ];

        const el = render(<Hand server={server} birds={birds} />);
        expect(el.getAllByTestId('bird')).toHaveLength(3);
    });

    it("displays no cards", function() {
        const el = render(<Hand server={server} birds={[]} />);
        expect(el.queryAllByTestId('bird')).toHaveLength(0);
    });

    it("plays cards", function() {
        const birds = [
            { ID: 1, Name: "Bird 1", Habitat: 0, EggCost: 0, EggLimit: 0, EggCount: 0 },
            { ID: 2, Name: "Bird 2", Habitat: 0, EggCost: 0, EggLimit: 0, EggCount: 0 },
            { ID: 3, Name: "Bird 3", Habitat: 0, EggCost: 0, EggLimit: 0, EggCount: 0 },
        ];

        const ctx = {
            state: GameState.Idle,
            current: "1",
            view: { ID: "1" }
        };

        const el = render(
            // @ts-ignore
            <GameContext.Provider value={ctx}>
                <Hand server={server} birds={birds} />
            </GameContext.Provider>
        );

        const spy = jest.spyOn(server, "send");
        const hand = el.getAllByTestId("bird");
        fireEvent.click(hand[1]);

        expect(spy).toHaveBeenCalledWith({
            Method: Command.PlayBird,
            Params: 2,
        });
    });
});
