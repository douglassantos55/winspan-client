import { Server } from "../server";

describe("server", function() {
    const fakeSocket = {
        send(_: string | ArrayBufferLike | Blob | ArrayBufferView): void { },
        onmessage: function(_: MessageEvent<string>): any { },
    };

    it("sends", function() {
        const socket = new Server(fakeSocket);
        const spy = jest.spyOn(fakeSocket, "send");

        const expected = { Method: "Test.Send", Params: [] };
        socket.send(expected);

        expect(spy).toHaveBeenCalledWith(JSON.stringify(expected));
    });

    it("dispatches", function() {
        const socket = new Server(fakeSocket);
        const callback = jest.fn();

        socket.on("test", callback);

        fakeSocket.onmessage(new MessageEvent("test", {
            data: JSON.stringify({
                Type: "test",
                Payload: null,
            }),
        }));

        expect(callback).toHaveBeenCalled();
    });
});
