type Props = {
    disabled: boolean;
    onClick: () => void;
}

function Food(props: Props) {
    return (
        <div {...props}>
            Food
        </div>
    );
}

export default Food;
