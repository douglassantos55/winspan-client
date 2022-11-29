import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Game from '../routes/Game';

describe('Game', function() {
    const state = {
        birds: [
            { ID: 1, Name: 'Bird 1' },
            { ID: 2, Name: 'Bird 2' },
            { ID: 3, Name: 'Bird 3' },
            { ID: 4, Name: 'Bird 4' },
            { ID: 5, Name: 'Bird 5' },
        ],
        food: {
            0: 2,
            2: 1,
            3: 1,
            4: 1,
        }
    }


    it('choose cards', function() {
        const el = render(
            <MemoryRouter initialEntries={[{ state }]}>
                <Game />
            </MemoryRouter>
        );

        expect(el.container).toHaveTextContent('Choose which birds to keep');
        expect(el.container).toHaveTextContent('Bird 1');
        expect(el.container).toHaveTextContent('Bird 2');
        expect(el.container).toHaveTextContent('Bird 3');
        expect(el.container).toHaveTextContent('Bird 4');
        expect(el.container).toHaveTextContent('Bird 5');
    });

    it('toggles cards', function() {
        const el = render(
            <MemoryRouter initialEntries={[{ state }]}>
                <Game />
            </MemoryRouter>
        );

        const cards = el.getAllByTestId('card');

        fireEvent.click(cards[0]);
        fireEvent.click(cards[3]);

        expect(cards[0].hasAttribute('disabled')).toBe(true);
        expect(cards[3].hasAttribute('disabled')).toBe(true);

        fireEvent.click(cards[0]);
        fireEvent.click(cards[3]);

        expect(cards[0].hasAttribute('disabled')).toBe(false);
        expect(cards[3].hasAttribute('disabled')).toBe(false);
    });
});
