import { act, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MatchFound from "../routes/MatchFound";
import { Command, Response, ServerImpl } from "../server";
import fakeSocket from './_fakeSocket';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', function() {
    return {
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
    };
});

describe('MatchFound', function() {
    const server = new ServerImpl(fakeSocket);

    it('accepts match', function() {
        const spy = jest.spyOn(server, 'send');

        const el = render(<MemoryRouter initialEntries={[{ state: {} }]}>
            <MatchFound server={server} />
        </MemoryRouter>);

        fireEvent.click(el.getByTestId('accept'));
        expect(spy).toHaveBeenCalledWith({ Method: Command.AcceptMatch });
    });

    it('declines match', function() {
        const el = render(<MemoryRouter initialEntries={[{ state: {} }]}>
            <MatchFound server={server} />
        </MemoryRouter>);
        fireEvent.click(el.getByTestId('decline'));

        const spy = jest.spyOn(server, 'send');
        expect(spy).toHaveBeenCalledWith({ Method: Command.DeclineMatch });
    });

    it('changes text after accepting', async function() {
        const el = render(<MemoryRouter initialEntries={[{ state: {} }]}>
            <MatchFound server={server} />
        </MemoryRouter>);

        act(() => fakeSocket.dispatch('test', { Type: Response.WaitOtherPlayers }));

        expect(el.queryByTestId('accept')).toBeNull();
        expect(el.queryByTestId('decline')).toBeNull();
        expect(el.container).toHaveTextContent('Waiting for other players');
    });

    it('redirects when game starts', function() {
        render(<MemoryRouter initialEntries={[{ state: {} }]}>
            <MatchFound server={server} />
        </MemoryRouter>);

        act(() => fakeSocket.dispatch('test', { Type: Response.ChooseCards }));
        expect(mockNavigate).toHaveBeenCalledWith('/game');
    });

    it('redirects when match is declined', function() {
        render(<MemoryRouter initialEntries={[{ state: {} }]}>
            <MatchFound server={server} />
        </MemoryRouter>);

        act(() => fakeSocket.dispatch('test', { Type: Response.MatchDeclined }));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
