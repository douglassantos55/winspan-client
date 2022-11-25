type Payload = Record<string, any>
type Callback = (payload: Payload) => void;

interface Transport {
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    onmessage: ((ev: MessageEvent) => any) | null;
}

export class Server {
    private listeners: Map<string, Callback[]>

    constructor(private socket: Transport) {
        this.listeners = new Map<string, Callback[]>();

        this.socket.onmessage = (message: MessageEvent<string>) => {
            const data = JSON.parse(message.data);
            this._dispatch(data.Type, data.Payload);
        };
    }

    private _dispatch(event: string, payload: Payload) {
        const listeners = this.listeners.get(event);
        if (listeners !== undefined) {
            for (const listener of listeners) {
                listener(payload);
            }
        }
    }

    public on(event: string, callback: () => void) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.push(callback);
        this.listeners.set(event, callbacks);

    }

    public send(data: Record<string, any>) {
        this.socket.send(JSON.stringify(data));
    }
}

export default new Server(new WebSocket("ws:127.0.0.1:8080"));
