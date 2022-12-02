import BoardRow from "./BoardRow";
import styles from "./Board.module.css";

function Board() {
    return (
        <div className={styles.board}>
            <BoardRow
                actionName="Gain food"
                actionDescription="from Birdfeeder"
                icon="http://placeimg.com/20/20"
            />
            <BoardRow
                actionName="Lay eggs"
                actionDescription="on birds"
                icon="http://placeimg.com/20/20"
            />
            <BoardRow
                actionName="Draw bird cards"
                icon="http://placeimg.com/20/20"
            />
        </div>
    );
}

export default Board;
