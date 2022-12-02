import { render } from "@testing-library/react";
import Board from "../routes/Game/Board";
import BoardRow from "../routes/Game/BoardRow";
import { Bird } from "../types";

describe('Board', function() {
    it('renders rows', function() {
        const rows = {
            0: [null, null, null, null, null],
            1: [null, null, null, null, null],
        };
        const el = render(<Board rows={rows} />);
        expect(el.getAllByTestId('row')).toHaveLength(2);
    });

    it('renders slots', function() {
        const slots: Array<Bird | null> = [null];
        const el = render(<BoardRow icon="" amount={(idx: number) => idx} actionName="" slots={slots} />);

        expect(el.getAllByTestId('slot')).toHaveLength(1);
    });

    it('renders birds on slots', function() {
        const slots: Array<Bird | null> = [null, null, { ID: 1, Name: 'Bird' }];
        const el = render(<BoardRow icon="" amount={(idx: number) => idx} actionName="" slots={slots} />);

        const renderedSlots = el.getAllByTestId('slot');
        expect(renderedSlots).toHaveLength(3);

        expect(renderedSlots[0]).not.toHaveTextContent('Bird');
        expect(renderedSlots[1]).not.toHaveTextContent('Bird');
        expect(renderedSlots[2]).toHaveTextContent('Bird');
    });

    it('has different amount for each slot', function() {
        const slots: Array<Bird | null> = [null, null];
        const el = render(<BoardRow icon="" amount={(idx: number) => idx} actionName="" slots={slots} />);

        expect(el.getAllByTestId('resource')).not.toHaveLength(2);
    });
});
