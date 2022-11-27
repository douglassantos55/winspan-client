import { fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MatchFound from "../routes/MatchFound";
import { Command, ServerImpl } from "../server";
import fakeSocket from './_fakeSocket';

describe('MatchFound', function() {
    const server = new ServerImpl(fakeSocket);

    it('accepts match', function() {
        const spy = jest.spyOn(server, 'send');
        const el = render(<MatchFound server={server} />, { wrapper: MemoryRouter });

        fireEvent.click(el.getByTestId('accept'));
        expect(spy).toHaveBeenCalledWith({ Method: Command.AcceptMatch });
        expect(el.container).toHaveTextContent('Waiting for other players');
    });

    it('declines match', function() {
        const el = render(<MatchFound server={server} />, { wrapper: MemoryRouter });
        fireEvent.click(el.getByTestId('decline'));

        const spy = jest.spyOn(server, 'send');
        expect(spy).toHaveBeenCalledWith({ Method: Command.DeclineMatch });
    });
});
