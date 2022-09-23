import {IEntity} from "./IEntity";

export abstract class BaseEntity implements IEntity {
    public readonly id: string | undefined

    protected constructor(id: string | undefined) {
        this.id = id
    }

    equals(other: IEntity): boolean {
        if(!other || !other.id){
            return false
        }
        return this.id === other.id
    }

}