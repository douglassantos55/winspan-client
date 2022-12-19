import { fireEvent, render } from "@testing-library/react";
import Deck from "../routes/Game/Deck";
import { GameContext } from "../routes/Game/Play";
import { Command, ServerImpl } from "../server";
import { GameState } from "../types";
import fakeSocket from "./_fakeSocket";

describe("Deck", function() {
    const server = new ServerImpl(fakeSocket);

    it("draws cards", function() {
        const ctx = { state: GameState.Idle };

        const el = render(
            // @ts-ignore
            <GameContext.Provider value={ctx}>
                <Deck server={server} />
            </GameContext.Provider>
        );

        const spy = jest.spyOn(server, "send");
        fireEvent.click(el.getByTestId("deck"))

        expect(spy).toHaveBeenCalledWith({
            Method: Command.DrawFromDeck,
            Params: undefined,
        });
    });
});
