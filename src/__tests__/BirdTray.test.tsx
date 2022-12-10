import { act, fireEvent, render } from "@testing-library/react";
import BirdTray from "../routes/Game/BirdTray";
import { Command, Response, ServerImpl } from "../server";
import _fakeSocket from "./_fakeSocket";

describe("Bird Tray", function() {
    const server = new ServerImpl(_fakeSocket);

    it("renders birds", function() {
        const birds = [
            { ID: 1, Name: "Bird 1" },
            { ID: 2, Name: "Bird 2" },
        ];

        const el = render(<BirdTray birds={birds} server={server} />);
        expect(el.getAllByTestId('bird')).toHaveLength(2);
    });

    it("renders no birds", function() {
        const el = render(<BirdTray birds={[]} server={server} />);
        expect(el.queryAllByTestId('bird')).toHaveLength(0);
    });

    it("draws birds from tray", function() {
        const tray = [{ ID: 1, Name: "1" }, { ID: 2, Name: "2" }];
        const el = render(<BirdTray birds={tray} server={server} />);

        const spy = jest.spyOn(server, "send");
        let birds = el.getAllByTestId("bird");

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
