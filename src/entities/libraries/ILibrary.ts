import {IBorrower, Person} from "../people"
import {IThing} from "../things"
import {ILoan} from "../loans"
import {ILocation, DueDate, IMoney, MOPServer} from "../../valueItems"
import {IWaitingList} from "../waitingLists"
import {IEntity} from "../IEntity"

export interface ILibrary extends IEntity{
    readonly name: string
    readonly borrowers: Iterable<IBorrower>
    readonly administrator: Person
    readonly location: ILocation
    /**
     * URL to go for information on this library
     */
    readonly publicURL: URL | undefined
    /**
     * Connection information for the MOP server that this server can federate with
     */
    readonly mopServer: MOPServer

    getAllThings(): Iterable<IThing>
    getAvailableThings(): Iterable<IThing>

    canBorrow(borrower: IBorrower): boolean

    borrow(thing: IThing, borrower: IBorrower, until: DueDate): Promise<ILoan>

    startReturn(loan: ILoan): Promise<ILoan>
    finishReturn(loan: ILoan): Promise<ILoan>

    // reserve the next available item
    reserveItem(thing: IThing, borrower: IBorrower): Promise<IWaitingList>
    bidToSkipToFrontOfList(thing: IThing, bidder: IBorrower, amount: IMoney, borrower?: IBorrower): Promise<IWaitingList>
}