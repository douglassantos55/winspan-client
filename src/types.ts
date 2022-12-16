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
