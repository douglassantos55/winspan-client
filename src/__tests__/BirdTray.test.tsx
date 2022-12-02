import { render } from "@testing-library/react";
import BirdTray from "../routes/Game/BirdTray";

describe("Bird Tray", function() {
    it("renders birds", function() {
        const birds = [
            { ID: 1, Name: "Bird 1" },
            { ID: 2, Name: "Bird 2" },
        ];

        const el = render(<BirdTray birds={birds} />);
        expect(el.getAllByTestId('bird')).toHaveLength(2);
    });

    it("renders no birds", function() {
        const el = render(<BirdTray birds={[]} />);
        expect(el.queryAllByTestId('bird')).toHaveLength(0);
    });
});
