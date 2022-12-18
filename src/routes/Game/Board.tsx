import BoardRow from "./BoardRow";
import styles from "./Board.module.css";
import { Habitat, Board as BoardType, Slots } from "../../types";
import { Server } from "../../server";
import forest from "../../assets/forest.png";
import grassland from "../../assets/grassland.png";
import wetland from "../../assets/wetland.png";
import foodDie from "../../assets/food-die.webp";
import egg from "../../assets/egg.png";
import card from "../../assets/bird-card-back.webp";

type Props = {
    server: Server;
    rows: BoardType;
}

const ACTIONS = {
    [Habitat.Forest]: {
        name: "Gain food",
        icon: forest,
        resource: foodDie,
        description: "from birdfeeder",
        amount: (idx: number) => Math.floor(idx / 2 + 1),
    },
    [Habitat.Grassland]: {
        name: "Lay eggs",
        description: "on birds",
        icon: grassland,
        resource: egg,
        amount: (idx: number) => Math.floor(idx / 2 + 2),
    },
    [Habitat.Wetland]: {
        name: "Draw bird cards",
        description: "",
        icon: wetland,
        resource: card,
        amount: (idx: number) => Math.floor(idx / 2 + 1),
    },
}

function Board({ rows, server }: Props) {
    return (
        <div className={styles.board}>
            {Object.values(rows).map(function(slots: Slots, habitat: Habitat) {
                return (
                    <BoardRow
                        key={habitat}
                        slots={slots}
                        server={server}
                        icon={ACTIONS[habitat].icon}
                        amount={ACTIONS[habitat].amount}
                        actionName={ACTIONS[habitat].name}
                        resource={ACTIONS[habitat].resource}
                        actionDescription={ACTIONS[habitat].description}
                    />
                )
            })}
        </div>
    );
}

export default Board;
