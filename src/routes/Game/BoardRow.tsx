import styles from "./BoardRow.module.css";
import BoardAction from "./BoardAction";
import BoardSlot from "./BoardSlot";

type Props = {
    icon: string;
    actionName: string;
    actionDescription?: string;
}

function BoardRow({ icon, actionName, actionDescription }: Props) {
    return (
        <div className={styles.row}>
            <BoardAction icon={icon} name={actionName} description={actionDescription} />

            <BoardSlot amount={1} icon={icon} resource="http://placeimg.com/20/20" />
            <BoardSlot amount={1} icon={icon} resource="http://placeimg.com/20/20" />
            <BoardSlot amount={2} icon={icon} resource="http://placeimg.com/20/20" />
            <BoardSlot amount={2} icon={icon} resource="http://placeimg.com/20/20" />
            <BoardSlot amount={3} icon={icon} resource="http://placeimg.com/20/20" />
        </div>
    );
}

export default BoardRow;
