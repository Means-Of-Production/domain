export declare class ThingTitle {
    readonly name: string;
    readonly isbn?: string;
    readonly upc?: string;
    description?: string;
    constructor(name: string, isbn?: string, upc?: string, description?: string);
    equals(other: ThingTitle): boolean;
    get hash(): string;
}
