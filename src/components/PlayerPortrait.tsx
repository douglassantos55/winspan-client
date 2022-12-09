import styles from "./PlayerPortrait.module.css";

type Props = {
    active?: boolean;
    highlighted?: boolean;
    player: { ID: string };
    onClick?: () => void;
}

function PlayerPortrait({ active, player, highlighted, onClick }: Props) {
    let className = styles.container;
    if (active) {
        className += " " + styles.active;
    }
    if (highlighted) {
        className += " " + styles.highlighted;
    }

    return (
        <div key={player.ID} className={className} data-testid="player" onClick={onClick}>
            <img
                src={`https://picsum.photos/30/30?rand=${player.ID}`}
                className={styles.image}
                alt={player.ID}
            />
        </div>
    );
}

export default PlayerPortrait;
