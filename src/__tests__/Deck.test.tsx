import { fireEvent, render } from "@testing-library/react";
import Deck from "../routes/Game/Deck";
import { Command, ServerImpl } from "../server";
import fakeSocket from "./_fakeSocket";

describe("Deck", function() {
    const server = new ServerImpl(fakeSocket);

    it("draws cards", function() {
        const el = render(<Deck server={server} />);
        const spy = jest.spyOn(server, "send");

        fireEvent.click(el.getByTestId("deck"))

        expect(spy).toHaveBeenCalledWith({
            Method: Command.DrawFromDeck,
            Params: undefined,
        });
    });
});
