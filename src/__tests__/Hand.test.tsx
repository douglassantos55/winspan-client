import { fireEvent, render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Hand from "../routes/Game/Hand";
import { Command, Response, ServerImpl } from "../server";
import _fakeSocket from "./_fakeSocket";

describe("Hand", function() {
    const server = new ServerImpl(_fakeSocket);

    it("displays cards", function() {
        const birds = [
            { ID: 1, Name: "Bird 1" },
            { ID: 2, Name: "Bird 2" },
            { ID: 3, Name: "Bird 3" },
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
            { ID: 1, Name: "Bird 1" },
            { ID: 2, Name: "Bird 2" },
            { ID: 3, Name: "Bird 3" },
        ];

        const el = render(<Hand server={server} birds={birds} />);
        const spy = jest.spyOn(server, "send");

        const hand = el.getAllByTestId("bird");
        fireEvent.click(hand[1]);

        expect(spy).toHaveBeenCalledWith({
            Method: Command.PlayBird,
            Params: 2,
        });
    });
});
