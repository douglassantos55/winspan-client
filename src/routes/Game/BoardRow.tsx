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

function BoardRow({ icon, slots, amount, server, actionName, actionDescription }: Props) {
    const [index, setIndex] = useState<number>(slots.length);

    useEffect(function() {
        const waitId = server.on(Response.WaitTurn, () => setIndex(slots.length));
        const startId = server.on(Response.StartTurn, () => setIndex(slots.length));

        const payCostId = server.on(Response.PayBirdCost, function(payload: Payload) {
            if (payload.EggCost > 0) {

            }
        });

        return function() {
            server.off(Response.WaitTurn, [waitId]);
            server.off(Response.StartTurn, [startId]);
            server.off(Response.PayBirdCost, [payCostId]);
        };
    }, [server, setIndex, slots]);

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
                        disabled={idx >= index}
                        resource="http://placeimg.com/20/20"
                        onClick={() => activatePower(idx)}
                    />
                );
            })}
        </div>
    );
}

export default BoardRow;
