import BoardRow from "./BoardRow";
import styles from "./Board.module.css";
import { Bird, Habitat } from "../../types";

type Props = {
    rows: Partial<Record<Habitat, Array<Bird | null>>>;
}

const ACTIONS = {
    [Habitat.Forest]: {
        name: "Gain food",
        icon: "http://placeimg.com/20/20",
        description: "from birdfeeder",
        amount: (idx: number) => Math.floor(idx / 2 + 1),
    },
    [Habitat.Grassland]: {
        name: "Lay eggs",
        description: "on birds",
        icon: "http://placeimg.com/20/20",
        amount: (idx: number) => Math.floor(idx / 2 + 2),
    },
    [Habitat.Wetland]: {
        name: "Draw bird cards",
        description: "",
        icon: "http://placeimg.com/20/20",
        amount: (idx: number) => Math.floor(idx / 2 + 1),
    },
}

function Board({ rows }: Props) {
    return (
        <div className={styles.board}>
            {Object.values(rows).map(function(slots: Array<Bird | null>, habitat: Habitat) {
                return (
                    <BoardRow
                        key={habitat}
                        slots={slots}
                        icon={ACTIONS[habitat].icon}
                        amount={ACTIONS[habitat].amount}
                        actionName={ACTIONS[habitat].name}
                        actionDescription={ACTIONS[habitat].description}
                    />
                )
            })}
        </div>
    );
}

export default Board;
