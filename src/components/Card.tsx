import { Bird } from "../types";

type Props = {
    bird: Bird;
    disabled: boolean;
    onClick: () => void;
}

function Card({ bird, ...props }: Props) {
    return (
        <div {...props}>
            <h2>{bird.Name}</h2>
        </div>
    );
}

export default Card;
