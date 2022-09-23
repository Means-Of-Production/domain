export interface IEntity {
    readonly id: string | undefined

    equals(other: IEntity): boolean
}