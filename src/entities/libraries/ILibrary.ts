import {IBorrower} from "../people/IBorrower";
import {IThing} from "../things/IThing";
import {ILoan} from "../loans/ILoan";
import {ThingTitle} from "../../valueItems/thingTitle";
import {IWaitingList} from "../waitingLists/IWaitingList";
import {Person} from "../people/person";
import {DueDate} from "../../valueItems/dueDate";
import {IMoney} from "../../valueItems/money/IMoney";
import {IEntity} from "../IEntity";

export interface ILibrary extends IEntity{
    readonly name: string
    readonly allTitles: Iterable<ThingTitle>
    readonly borrowers: Iterable<IBorrower>
    readonly administrator: Person
    readonly availableTitles: Iterable<ThingTitle>

    canBorrow(borrower: IBorrower): boolean

    borrow(item: IThing, borrower: IBorrower, until: DueDate): ILoan

    startReturn(loan: ILoan): ILoan
    finishReturn(loan: ILoan): ILoan

    // reserve the next available item
    reserveItem(item: IThing, borrower: IBorrower): IWaitingList
    bidToSkipToFrontOfList(item: IThing, bidder: IBorrower, amount: IMoney, borrower?: IBorrower): IWaitingList
}