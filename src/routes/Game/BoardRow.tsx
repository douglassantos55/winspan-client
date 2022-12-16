import styles from "./BoardRow.module.css";
import BoardAction from "./BoardAction";
import BoardSlot from "./BoardSlot";
import { Bird, Slots } from "../../types";
import { Command, Payload, Response, Server } from "../../server";
import { useEffect, useState } from "react";

type Props = {
    icon: string;
    actionName: string;
    slots: Slots;
    server: Server;
    actionDescription?: string;
    amount: (idx: number) => number;
}

type EggBag = Record<number, number>;

function BoardRow({ icon, slots, amount, server, actionName, actionDescription }: Props) {
    const [eggCost, setEggCost] = useState(-1);
    const [birdID, setBirdID] = useState<number>();
    const [chosen, setChosen] = useState<EggBag>({});
    const [index, setIndex] = useState<number>(slots.length);

    useEffect(function() {
        const waitId = server.on(Response.WaitTurn, () => setIndex(slots.length));
        const startId = server.on(Response.StartTurn, () => setIndex(slots.length));

        const payCostId = server.on(Response.PayBirdCost, function(payload: Payload) {
            setEggCost(payload.EggCost);
            setBirdID(payload.BirdID);
        });

        return function() {
            server.off(Response.WaitTurn, [waitId]);
            server.off(Response.StartTurn, [startId]);
            server.off(Response.PayBirdCost, [payCostId]);
        };
    }, [server, setIndex, slots]);

    useEffect(function() {
        const total = Object.values(chosen).reduce(function(total: number, qty: number) {
            return total + qty;
        }, 0);

        if (total === eggCost) {
            server.send({
                Method: Command.PayBirdCost,
                Params: { Food: [], Eggs: chosen, BirdID: birdID },
            });
            setChosen({});
            setEggCost(-1);
        }
    }, [chosen, eggCost, server, setChosen, setEggCost]);

    function selectBird(idx: number) {
        if (eggCost === -1) {
            activatePower(idx);
        } else {
            selectEgg(idx)
        }
    }

    function selectEgg(idx: number) {
        const bird = slots[idx] as Bird;
        setChosen((curr: EggBag) => {
            const qty = curr[bird.ID] || 0;
            return { ...curr, [bird.ID]: qty + 1 };
        });
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
                        disabled={(bird && eggCost > 0 && bird.EggCount < eggCost) || idx >= index}
                    />
                );
            })}
        </div>
    );
}

export default BoardRow;
