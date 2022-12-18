import styles from "./BoardRow.module.css";
import BoardAction from "./BoardAction";
import BoardSlot from "./BoardSlot";
import { Bird, GameState, Slots } from "../../types";
import { Command, Payload, Response, Server } from "../../server";
import { useContext, useEffect, useState } from "react";
import usePayCost, { Chosen, Cost } from "../../hooks/usePayCost";
import { GameContext } from "./Play";

type Props = {
    icon: string;
    actionName: string;
    slots: Slots;
    server: Server;
    actionDescription?: string;
    amount: (idx: number) => number;
}

function BoardRow({ icon, slots, amount, server, actionName, actionDescription }: Props) {
    const { state } = useContext(GameContext);

    const [index, setIndex] = useState<number>(0);
    const { total, cost, setCost, chosen, setChosen } = usePayCost();

    useEffect(function() {
        if (state === GameState.Idle || state === GameState.Waiting) {
            setIndex(0);
            setChosen({ Food: [], Eggs: {} });
            setCost({ Food: [], Birds: [], EggCost: -1, BirdID: -1 });
        } else if (state === GameState.ActivatePower) {
            setIndex(slots.length);
        }
    }, [slots, state, setIndex, setCost, setChosen]);

    useEffect(function() {
        const waitId = server.on(Response.WaitTurn, () => setIndex(0));
        const startId = server.on(Response.StartTurn, () => setIndex(0));

        const payCostId = server.on(Response.PayBirdCost, function(payload: Payload) {
            setCost((curr: Cost) => ({ ...curr, ...payload }));
        });

        return function() {
            server.off(Response.WaitTurn, [waitId]);
            server.off(Response.StartTurn, [startId]);
            server.off(Response.PayBirdCost, [payCostId]);
        };
    }, [cost, setCost, server, setIndex, slots]);

    useEffect(function() {
        if (total() === cost.EggCost && (chosen.Food.length !== 0 || cost.Food.length === 0)) {
            server.send({
                Method: Command.PayBirdCost,
                Params: { ...chosen, BirdID: cost.BirdID },
            });

            setChosen({ Food: [], Eggs: {} });
            setCost({ Food: [], Birds: [], EggCost: -1, BirdID: -1 });
        }
    }, [total, setChosen, cost, chosen, setCost, server]);

    function selectBird(idx: number) {
        if (cost.EggCost === -1) {
            if (state === GameState.ActivatePower) {
                activatePower(idx);
            }
        } else {
            selectEgg(idx)
        }
    }

    function selectEgg(idx: number) {
        const bird = slots[idx] as Bird;
        const qty = chosen.Eggs[bird.ID] || 0;

        setChosen((curr: Chosen) => ({
            ...curr,
            Eggs: { ...curr.Eggs, [bird.ID]: qty + 1 },
        }));
    }

    function activatePower(idx: number) {
        const slot = slots[idx];
        if (slot !== null) {
            setIndex(idx);
            server.send({
                Method: Command.ActivatePower,
                Params: slot.ID,
            });
        }
    }

    return (
        <div className={styles.row} data-testid="row">
            <BoardAction icon={icon} name={actionName} description={actionDescription} />

            {slots.map(function(bird: Bird | null, idx: number) {
                return (
                    <BoardSlot
                        key={idx}
                        icon={icon}
                        bird={bird}
                        amount={amount(idx)}
                        resource="http://placeimg.com/20/20"
                        onClick={() => selectBird(idx)}
                        disabled={(bird && cost.EggCost > 0 && bird.EggCount < cost.EggCost) || idx >= index}
                    />
                );
            })}
        </div>
    );
}

export default BoardRow;
