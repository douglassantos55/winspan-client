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
}

export enum Habitat {
    Forest,
    Grassland,
    Wetland,
}

export type Board = {
    [k in Habitat]: Array<Bird | null>;
}
