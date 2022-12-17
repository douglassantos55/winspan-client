import { act, fireEvent, render } from "@testing-library/react";
import Food from "../routes/Game/Food";
import { Command, Response, ServerImpl } from "../server";
import { FoodType } from "../types";
import _fakeSocket from "./_fakeSocket";

describe("Food", function() {
    const server = new ServerImpl(_fakeSocket);

    it("renders food", function() {
        const food = { 0: 1, 1: 2, 2: 2 };
        const el = render(<Food food={food} server={server} />);

        const playerFood = el.getAllByTestId("player-food");

        expect(playerFood).toHaveLength(5);
        expect(playerFood[0].hasAttribute("disabled")).toBe(true);
        expect(playerFood[1].hasAttribute("disabled")).toBe(true);
        expect(playerFood[2].hasAttribute("disabled")).toBe(true);
        expect(playerFood[3].hasAttribute("disabled")).toBe(true);
        expect(playerFood[4].hasAttribute("disabled")).toBe(true);
    });

    it("selects food", function() {
        const food = {
            [FoodType.Seed]: 2,
            [FoodType.Fish]: 2,
            [FoodType.Rodent]: 1,
        };

        const spy = jest.spyOn(server, "send");
        const el = render(<Food food={food} server={server} />);

        act(() => _fakeSocket.dispatch("test", {
            Type: Response.PayBirdCost,
            Payload: {
                BirdID: 2,
                Birds: [],
                EggCost: 0,
                Food: [FoodType.Fish, FoodType.Rodent],
            }
        }));

        const playerFood = el.getAllByTestId("player-food");

        expect(playerFood[0].hasAttribute("disabled")).toBe(true);
        expect(playerFood[1].hasAttribute("disabled")).toBe(true);
        expect(playerFood[2].hasAttribute("disabled")).toBe(false);
        expect(playerFood[3].hasAttribute("disabled")).toBe(false);
        expect(playerFood[4].hasAttribute("disabled")).toBe(false);

        fireEvent.click(playerFood[4]);

        expect(spy).toHaveBeenCalledWith({
            Method: Command.PayBirdCost,
            Params: { Food: [FoodType.Rodent], Eggs: {}, BirdID: 2 },
        });
    });
});
