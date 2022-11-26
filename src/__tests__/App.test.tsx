import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Queue from '../routes/Home';
import { Response, Command, ServerImpl } from '../server';
import fakeSocket from './_fakeSocket';

describe('Queue', () => {
    const server = new ServerImpl(fakeSocket);

    it('sends queue up command to server', function() {
        const queue = render(<Queue server={server} />, { wrapper: MemoryRouter });
        const button = queue.getByTestId('queue-up');

        const spy = jest.spyOn(server, 'send');
        button.click();

        expect(spy).toHaveBeenCalledWith({ Method: Command.QueueUp });
    });

    it('disables button after queueing up', async function() {
        const queue = render(<Queue server={server} />, { wrapper: MemoryRouter });
        const button = queue.getByTestId('queue-up');

        await act(() => fakeSocket.dispatch('test', { Type: Response.WaitForMatch }));
        expect(button.hasAttribute('disabled')).toBe(true);
    });

    it('enables button after match is declined', async function() {
        const queue = render(<Queue server={server} />, { wrapper: MemoryRouter });
        const button = queue.getByTestId('queue-up');

        await act(() => fakeSocket.dispatch('test', { Type: Response.WaitForMatch }));
        expect(button.hasAttribute('disabled')).toBe(true);

        await act(() => fakeSocket.dispatch('test', { Type: Response.MatchDeclined }));
        expect(button.hasAttribute('disabled')).toBe(false);
    });
});
