export enum FoodType {
    Fruit,
    Seed,
    Invertebrate,
    Fish,
    Rodent,
}

export type Bird = {
    ID: number;
    Name: string;
    Habitat: Habitat;
    EggCost: number;
    EggCount: number;
    EggLimit: number;
}

export enum Habitat {
    Forest,
    Grassland,
    Wetland,
}

export type Slots = Array<Bird | null>;

export type Board = {
    [k in Habitat]: Slots;
}

export type FoodMap = {
    [k in FoodType]?: number;
}

export enum GameState {
    Idle,
    Waiting,
    Loading,
    ActivatePower,
}

export type Player = {
    ID: string;
    birds: Bird[];
    board: Board;
    food: FoodMap;
    turn: number;
}

export type Game = {
    player: string;
    state: GameState;
    current: string;
    view: Player;
    birdTray: Bird[];
    birdFeeder: FoodMap;
    round: number;
    maxTurns: number;
    turnDuration: number;
    timeLeft: number;
    players: Player[];
}

