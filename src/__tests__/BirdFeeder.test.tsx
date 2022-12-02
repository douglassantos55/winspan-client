import { render } from "@testing-library/react";
import BirdFeeder from "../routes/Game/BirdFeeder";

describe("Bird feeder", function() {
    it("renders food", function() {
        const food = { 0: 1, 1: 2 };
        const el = render(<BirdFeeder food={food} />);

        expect(el.getAllByTestId('food')).toHaveLength(3);
    });

    it("renders no food", function() {
        const el = render(<BirdFeeder food={{}} />);
        expect(el.queryAllByTestId('food')).toHaveLength(0);
    });
});
