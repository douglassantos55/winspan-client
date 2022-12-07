import { act, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InitialResources from '../routes/Game/InitialResources';
import { Command, Response, ServerImpl } from '../server';
import fakeSocket from './_fakeSocket';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', function() {
    return {
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
    };
});

describe('InitialResources', function() {
    const server = new ServerImpl(fakeSocket);

    const state = {
        Birds: [
            { ID: 1, Name: 'Bird 1' },
            { ID: 2, Name: 'Bird 2' },
            { ID: 3, Name: 'Bird 3' },
            { ID: 4, Name: 'Bird 4' },
            { ID: 5, Name: 'Bird 5' },
        ],

        Food: {
            0: 2,
            2: 1,
            3: 1,
            4: 1,
        }
    };

    it('displays food', function() {
        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <InitialResources server={server} />
        </MemoryRouter>);

        const food = el.getAllByTestId('food');
        expect(food.length).toBe(5);

        for (let i = 0; i < food.length; i++) {
            expect(food[i].hasAttribute('disabled')).toBe(true);
        }
    });

    it('displays cards', function() {
        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <InitialResources server={server} />
        </MemoryRouter>);

        expect(el.container).toHaveTextContent('Choose which birds to keep');
        expect(el.container).toHaveTextContent('Bird 1');
        expect(el.container).toHaveTextContent('Bird 2');
        expect(el.container).toHaveTextContent('Bird 3');
        expect(el.container).toHaveTextContent('Bird 4');
        expect(el.container).toHaveTextContent('Bird 5');
    });

    it('toggles cards', function() {
        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <InitialResources server={server} />
        </MemoryRouter>);

        const birds = el.getAllByTestId('bird');

        fireEvent.click(birds[0]);
        fireEvent.click(birds[3]);

        expect(birds[0].classList.contains('selected')).toBe(true);
        expect(birds[3].classList.contains('selected')).toBe(true);

        fireEvent.click(birds[0]);
        fireEvent.click(birds[3]);

        expect(birds[0].classList.contains('selected')).toBe(false);
        expect(birds[3].classList.contains('selected')).toBe(false);
    });

    it('chooses cards', function() {
        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <InitialResources server={server} />
        </MemoryRouter>);

        const spy = jest.spyOn(server, 'send');
        const birds = el.getAllByTestId('bird');

        fireEvent.click(birds[0]);
        fireEvent.click(birds[3]);

        fireEvent.click(el.getByTestId('choose'));
        expect(spy).toHaveBeenCalledWith({ Method: Command.ChooseBirds, Params: [1, 4] });
    });

    it('allows choosing food', function() {
        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <InitialResources server={server} />
        </MemoryRouter>);

        act(() => fakeSocket.dispatch('test', { Type: Response.DiscardFood, Payload: 3 }));
        expect(el.container).toHaveTextContent("Choose 3 food to discard");

        const food = el.getAllByTestId('food');
        for (let i = 0; i < food.length; i++) {
            expect(food[i].hasAttribute('disabled')).toBe(false);
        }
    });

    it('toggles food', function() {
        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <InitialResources server={server} />
        </MemoryRouter>);
        const birds = el.getAllByTestId('bird');

        fireEvent.click(birds[0]);
        fireEvent.click(birds[1]);
        fireEvent.click(birds[2]);

        act(() => fakeSocket.dispatch('test', { Type: Response.DiscardFood, Payload: 3 }));
        const food = el.getAllByTestId('food');

        fireEvent.click(food[0]);
        fireEvent.click(food[1]);
        fireEvent.click(food[2]);
        fireEvent.click(food[3]);

        expect(food[0].classList.contains('selected')).toBe(true);
        expect(food[1].classList.contains('selected')).toBe(true);
        expect(food[2].classList.contains('selected')).toBe(true);
        expect(food[3].classList.contains('selected')).toBe(false);

        fireEvent.click(food[0]);
        fireEvent.click(food[1]);
        fireEvent.click(food[2]);
        fireEvent.click(food[3]);

        expect(food[0].classList.contains('selected')).toBe(false);
        expect(food[1].classList.contains('selected')).toBe(false);
        expect(food[2].classList.contains('selected')).toBe(false);
        expect(food[3].classList.contains('selected')).toBe(true);
    });

    it('chooses food', function() {
        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <InitialResources server={server} />
        </MemoryRouter>);

        const spy = jest.spyOn(server, 'send');
        const birds = el.getAllByTestId('bird');

        fireEvent.click(birds[0]);
        fireEvent.click(birds[1]);

        act(() => fakeSocket.dispatch('test', { Type: Response.DiscardFood, Payload: 2 }));

        const food = el.getAllByTestId('food');

        fireEvent.click(food[0]);
        fireEvent.click(food[1]);

        fireEvent.click(el.getByTestId('choose'));
        expect(spy).toHaveBeenCalledWith({ Method: Command.DiscardFood, Params: { 0: 2 } });
    });

    it('redirects after game is cancelled', function() {
        render(<MemoryRouter initialEntries={[{ state }]}>
            <InitialResources server={server} />
        </MemoryRouter>);

        act(() => fakeSocket.dispatch('test', { Type: Response.GameCanceled }));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('waits other players', function() {
        const el = render(<MemoryRouter initialEntries={[{ state }]}>
            <InitialResources server={server} />
        </MemoryRouter>);

        act(() => fakeSocket.dispatch('test', { Type: Response.WaitOtherPlayers }));
        expect(el.container).toHaveTextContent('Waiting other players');
    });

    it('redirects when game starts', function() {
        render(<MemoryRouter initialEntries={[{ state }]}>
            <InitialResources server={server} />
        </MemoryRouter>);

        act(() => fakeSocket.dispatch('test', { Type: Response.GameStarted, Payload: "playerid" }));
        expect(mockNavigate).toHaveBeenCalledWith('/game/play/playerid');
    });
});
