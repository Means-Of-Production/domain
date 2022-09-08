import {IBorrower, Person} from "../people"
import {IThing} from "../things"
import {ILoan} from "../loans"
import {ThingTitle, DueDate, IMoney} from "../../valueItems"
import {IWaitingList} from "../waitingLists"
import {IEntity} from "../IEntity"

export interface ILibrary extends IEntity{
    readonly name: string
    readonly borrowers: Iterable<IBorrower>
    readonly administrator: Person

    getAllThings(): Iterable<IThing>
    getAvailableThings(): Iterable<IThing>

    canBorrow(borrower: IBorrower): boolean

    borrow(item: IThing, borrower: IBorrower, until: DueDate): ILoan

    startReturn(loan: ILoan): ILoan
    finishReturn(loan: ILoan): ILoan

    // reserve the next available item
    reserveItem(item: IThing, borrower: IBorrower): IWaitingList
    bidToSkipToFrontOfList(item: IThing, bidder: IBorrower, amount: IMoney, borrower?: IBorrower): IWaitingList
}