import { useCallback, useEffect, useState } from "react";
import { Bird, FoodType } from "../types";

export type EggBag = Record<number, number>;

export type Cost = {
    Food: FoodType[];
    Birds: Bird[];
    BirdID: number;
    EggCost: number;
}

export type Chosen = {
    Food: FoodType[];
    Eggs: EggBag;
}

const state: Chosen = {
    Food: [],
    Eggs: {},
}

const defaultCost: Cost = {
    Food: [],
    Birds: [],
    EggCost: -1,
    BirdID: -1,
}

function usePayCost() {
    const [chosen, setChosen] = useState(state);
    const [cost, setCost] = useState<Cost>(defaultCost);

    useEffect(function() {
        defaultCost.Food = cost.Food;
        defaultCost.Birds = cost.Birds;
        defaultCost.BirdID = cost.BirdID;
        defaultCost.EggCost = cost.EggCost;
    }, [cost]);

    useEffect(function() {
        state.Food = chosen.Food;
        state.Eggs = chosen.Eggs;
    }, [chosen]);

    const total = useCallback(function() {
        return Object.values(chosen.Eggs).reduce((total: number, qty: number) => {
            return total + qty;
        }, 0);
    }, [chosen]);

    return { total, cost, setCost, chosen, setChosen };
}

export default usePayCost;
