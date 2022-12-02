import styles from "./BoardRow.module.css";
import BoardAction from "./BoardAction";
import BoardSlot from "./BoardSlot";
import { Bird } from "../../types";

type Props = {
    icon: string;
    actionName: string;
    slots: Array<Bird | null>;
    actionDescription?: string;
    amount: (idx: number) => number;
}

function BoardRow({ icon, slots, amount, actionName, actionDescription }: Props) {
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
                    />
                );
            })}
        </div>
    );
}

export default BoardRow;
