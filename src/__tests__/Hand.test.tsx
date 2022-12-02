import { render } from "@testing-library/react";
import Hand from "../routes/Game/Hand";

describe("Hand", function() {
    it("displays cards", function() {
        const birds = [
            { ID: 1, Name: "Bird 1" },
            { ID: 2, Name: "Bird 2" },
            { ID: 3, Name: "Bird 3" },
        ];

        const el = render(<Hand birds={birds} />);
        expect(el.getAllByTestId('bird')).toHaveLength(3);
    });

    it("displays no cards", function() {
        const el = render(<Hand birds={[]} />);
        expect(el.queryAllByTestId('bird')).toHaveLength(0);
    });
});
