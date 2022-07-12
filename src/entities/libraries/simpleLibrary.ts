import {IThing} from "../things/IThing";
import {IBorrower} from "../people/IBorrower";
import {ILoan} from "../loans/ILoan";
import {BaseLibrary} from "./baseLibrary"
import {ThingTitle} from "../../valueItems/thingTitle";
import {ThingStatus} from "../../valueItems/thingStatus";
import {Loan} from "../loans/loan";
import {Location} from "../../valueItems/location";
import {ILender} from "../lenders/ILender";
import {IWaitingListFactory} from "../../factories/IWaitingListFactory";
import {Person} from "../people/person";
import {LoanStatus} from "../../valueItems/loanStatus";
import {IMoney} from "../../valueItems/money/IMoney";
import {DueDate} from "../../valueItems/dueDate";


// library which also lends items from a simple, single, location
export class SimpleLibrary extends BaseLibrary implements ILender{
    private readonly _items: IThing[];
    readonly location: Location

    constructor(name: string, admin: Person, location: Location,
                waitingListFactory: IWaitingListFactory, maxFinesBeforeSuspension: IMoney, loans: Iterable<ILoan>) {
        super(name, admin, waitingListFactory, maxFinesBeforeSuspension, loans);
        this._items = []
        this.location = location
    }

    addItem(item: IThing): IThing{
        this._items.push(item)
        return item
    }

    get items(): Iterable<IThing>{
        return this._items
    }

    borrow(item: IThing, borrower: IBorrower, until: DueDate): ILoan {
        // check if available
        if(item.status !== ThingStatus.READY){
            throw new Error();
        }

        // check if borrower in good standing
        if(!this.canBorrow(borrower)){
            throw new Error();
        }

        //make loan
        const loan = new Loan(
            this.makeLoanId(),
            item,
            borrower,
            until,
            LoanStatus.LOANED,
            this.location,
            undefined
        )

        item.status = ThingStatus.CURRENTLY_BORROWED

        return loan
    }

    canBorrow(borrower: IBorrower): boolean {
        return borrower.library.name === this.name;
    }

    get allTitles(): Iterable<ThingTitle> {
        return this.getTitlesFromItems(this.items)
    }

    get availableTitles(): Iterable<ThingTitle>{
        const availableItems = Array.from(this.items).filter(i => i.status === ThingStatus.READY)

        return this.getTitlesFromItems(availableItems)
    }

    get id(): string{
        return this.name
    }

    public markAsDamaged(item: IThing): IThing {
        item.status = ThingStatus.DAMAGED
        return item
    }

    public startReturn(loan: ILoan): ILoan {
        return loan.startReturn()
    }

    public finishReturn(loan: ILoan): ILoan {
        const returnedLoad = loan.finishReturn(loan.item.status)
        if(returnedLoad.item.status == ThingStatus.DAMAGED){
            // apply the fees

        }

        if(returnedLoad.status == LoanStatus.OVERDUE){
            // calculate the late fee and apply
        }

        return returnedLoad
    }
}