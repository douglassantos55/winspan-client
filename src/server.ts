export enum Command {
    QueueUp = "Queue.Add",
    AcceptMatch = "Matchmaker.Accept",
    DeclineMatch = "Matchmaker.Decline",
    ChooseBirds = "Game.ChooseBirds",
    DiscardFood = "Game.DiscardFood",
}

export enum Response {
    WaitForMatch = "wait_for_match",
    MatchFound = "match_found",
    MatchDeclined = "match_denied",
    WaitOtherPlayers = "wait_other_players",
    ChooseCards = "choose_cards",
    DiscardFood = "discard_food",
    GameCanceled = "game_canceled",
    GameStarted = "game_started",
    RoundStarted = "round_started",
    RoundEnded = "round_ended",
    StartTurn = "start_turn",
    WaitTurn = "wait_turn",
}

export type Payload = Record<string, any>
export type Callback = (payload: Payload) => void;

interface Transport {
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    onmessage: ((ev: MessageEvent) => any) | null;
}

export interface Server {
    on(event: string, callback: (payload: any) => void): number;
    off(event: string, listeners: number[]): void;
    send(data: Payload): void;
}

export class ServerImpl implements Server {
    private listeners: Map<string, Map<number, Callback>>

    constructor(private socket: Transport) {
        this.listeners = new Map<string, Map<number, Callback>>();

        this.socket.onmessage = (message: MessageEvent<string>) => {
            const data = JSON.parse(message.data);
            this._dispatch(data.Type, data.Payload);
        };
    }

    private _dispatch(event: string, payload: Payload) {
        const listeners = this.listeners.get(event);
        if (listeners !== undefined) {
            const iterator = listeners.values();
            let item = iterator.next();
            while (!item.done) {
                item.value(payload);
                item = iterator.next();
            }
        }
    }

    public on(event: string, callback: (payload: any) => void): number {
        let callbacks = this.listeners.get(event);

        if (callbacks === undefined) {
            callbacks = new Map<number, Callback>();
            this.listeners.set(event, callbacks);
        }

        let key = Math.ceil(Math.random() * 10000) + 1;
        if (callbacks.has(key)) {
            return this.on(event, callback);
        }

        callbacks.set(key, callback);
        return key
    }

    public off(event: string, listeners: number[]): void {
        const callbacks = this.listeners.get(event);
        if (callbacks !== undefined) {
            for (const id of listeners) {
                callbacks.delete(id);
            }
        }
    }

    public send(data: Record<string, any>) {
        this.socket.send(JSON.stringify(data));
    }
}

export default new ServerImpl(new WebSocket("ws:127.0.0.1:8080"));
