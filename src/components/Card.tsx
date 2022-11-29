export type Bird = {
    ID: number;
    Name: string;
}

type Props = {
    bird: Bird;
    disabled: boolean;
    onClick: () => void;
}

function Card(props: Props) {
    return (
        <div {...props}>
            <h2>{props.bird.Name}</h2>
        </div>
    );
}

export default Card;
