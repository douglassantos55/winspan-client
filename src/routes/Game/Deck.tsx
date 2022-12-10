import { Command, Server } from "../../server";

type Props = {
    server: Server
}

function Deck({ server }: Props) {
    function draw() {
        server.send({ Method: Command.DrawFromDeck });
    }

    return (
        <div onClick={draw} data-testid="deck"></div>
    );
}

export default Deck;
