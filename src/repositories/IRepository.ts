import {IEntity} from "../entities/IEntity";

export interface IRepository<T extends IEntity> {
    getAll(): Promise<Iterable<T>>
    get(id: string): Promise<T | null>
    add(item: T): Promise<T>
    update(item: T): Promise<T>
    delete(id: string) : Promise<boolean>
}