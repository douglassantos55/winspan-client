import { fireEvent, render } from "@testing-library/react";
import Board from "../routes/Game/Board";
import BoardRow from "../routes/Game/BoardRow";
import { Command, ServerImpl } from "../server";
import { Bird } from "../types";
import _fakeSocket from "./_fakeSocket";

describe('Board', function() {
    const server = new ServerImpl(_fakeSocket);

    it('renders rows', function() {
        const rows = {
            0: [null, null, null, null, null],
            1: [null, null, null, null, null],
            2: [null, null, null, null, null],
        };
        const el = render(<Board server={server} rows={rows} />);
        expect(el.getAllByTestId('row')).toHaveLength(3);
    });

    it('renders slots', function() {
        const slots: Array<Bird | null> = [null];
        const el = render(<BoardRow server={server} icon="" amount={(idx: number) => idx} actionName="" slots={slots} />);

        expect(el.getAllByTestId('slot')).toHaveLength(1);
    });

    it('renders birds on slots', function() {
        const slots: Array<Bird | null> = [
            null,
            null,
            { ID: 1, Name: 'Bird', EggCount: 0, EggCost: 0 }
        ];

        const el = render(<BoardRow server={server} icon="" amount={(idx: number) => idx} actionName="" slots={slots} />);
        const renderedSlots = el.getAllByTestId('slot');

        expect(renderedSlots).toHaveLength(3);
        expect(renderedSlots[0]).not.toHaveTextContent('Bird');
        expect(renderedSlots[1]).not.toHaveTextContent('Bird');
        expect(renderedSlots[2]).toHaveTextContent('Bird');
    });

    it('has different amount for each slot', function() {
        const slots: Array<Bird | null> = [null, null];
        const el = render(<BoardRow server={server} icon="" amount={(idx: number) => idx} actionName="" slots={slots} />);

        expect(el.getAllByTestId('resource')).not.toHaveLength(2);
    });

    it("activates Power", function() {
        const slots: Array<Bird | null> = [
            { ID: 1, Name: "1", EggCount: 0, EggCost: 0 },
            { ID: 2, Name: "2", EggCount: 0, EggCost: 0 },
            { ID: 3, Name: "3", EggCount: 0, EggCost: 0 },
            null,
            null,
        ];

        const el = render(
            <BoardRow
                icon=""
                actionName=""
                slots={slots}
                server={server}
                amount={(idx: number) => idx}
            />
        );

        const spy = jest.spyOn(server, "send");
        const birds = el.getAllByTestId("row-bird")

        expect(birds[0].hasAttribute("disabled")).toBe(false);
        expect(birds[1].hasAttribute("disabled")).toBe(false);
        expect(birds[2].hasAttribute("disabled")).toBe(false);

        fireEvent.click(birds[1]);

        expect(spy).toHaveBeenCalledWith({
            Method: Command.ActivatePower,
            Params: 2,
        });

        expect(birds[0].hasAttribute("disabled")).toBe(false);
        expect(birds[1].hasAttribute("disabled")).toBe(true);
        expect(birds[2].hasAttribute("disabled")).toBe(true);
    });
});
