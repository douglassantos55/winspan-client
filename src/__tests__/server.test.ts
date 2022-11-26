import { ServerImpl } from "../server";

describe("server", function() {
    const fakeSocket = {
        send(_: string | ArrayBufferLike | Blob | ArrayBufferView): void { },
        onmessage(_: MessageEvent<string>): any { },
        dispatch(event: string, payload: Record<string, any>) {
            this.onmessage(new MessageEvent(event, {
                data: JSON.stringify(payload),
            }));
        }
    };

    it("sends", function() {
        const server = new ServerImpl(fakeSocket);
        const spy = jest.spyOn(fakeSocket, "send");

        const expected = { Method: "Test.Send", Params: [] };
        server.send(expected);

        expect(spy).toHaveBeenCalledWith(JSON.stringify(expected));
    });

    it("dispatches", function() {
        const server = new ServerImpl(fakeSocket);

        const callback = jest.fn();
        server.on("test", callback);

        fakeSocket.dispatch('test', {
            Type: "test",
            Payload: null,
        });

        expect(callback).toHaveBeenCalled();
    });

    it('removes listeners', function() {
        const server = new ServerImpl(fakeSocket);
        const callback = jest.fn();
        const id = server.on('test', callback);

        server.off('test', [id]);

        fakeSocket.dispatch('test', {
            Type: "test",
            Payload: null,
        });

        expect(callback).not.toHaveBeenCalled();
    });
});
