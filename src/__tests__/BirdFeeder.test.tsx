import { act, fireEvent, render } from "@testing-library/react";
import BirdFeeder from "../routes/Game/BirdFeeder";
import { Command, Response, ServerImpl } from "../server";
import _fakeSocket from "./_fakeSocket";

describe("Bird feeder", function() {
    const server = new ServerImpl(_fakeSocket);

    it("renders food", function() {
        const food = { 0: 1, 1: 2 };
        const el = render(<BirdFeeder server={server} food={food} />);

        expect(el.getAllByTestId('feeder-food')).toHaveLength(3);
    });

    it("renders no food", function() {
        const el = render(<BirdFeeder server={server} food={{}} />);
        expect(el.queryAllByTestId('feeder-food')).toHaveLength(0);
    });

    it("gains food", function() {
        const food = { 0: 1, 1: 2 };
        const el = render(<BirdFeeder server={server} food={food} />);

        const spy = jest.spyOn(server, "send");

        const available = el.getAllByTestId("feeder-food");
        fireEvent.click(available[1]);

        expect(spy).toHaveBeenCalledWith({
            Method: Command.GainFood,
            Params: undefined,
        });
    });

    it("chooses food", function() {
        const food = { 0: 1, 1: 2, 2: 1 };
        const el = render(<BirdFeeder server={server} food={food} />);

        const spy = jest.spyOn(server, "send");
        const available = el.getAllByTestId("feeder-food");

        fireEvent.click(available[0]);

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.ChooseFood,
            Payload: {
                Amount: 2,
                Available: food,
            },
        }));

        fireEvent.click(available[1]);

        expect(spy).toHaveBeenCalledWith({
            Method: Command.ChooseFood,
            Params: { 0: 1, 1: 1 },
        });
    });
});
