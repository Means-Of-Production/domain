import {IThing} from "../things/IThing";
import {IBorrower} from "../people/IBorrower";
import {ILoan} from "../loans/ILoan";
import {BaseLibrary} from "./baseLibrary"
import {ThingTitle} from "../../valueItems/thingTitle";
import {ThingStatus} from "../../valueItems/thingStatus";
import {Loan} from "../loans/loan";
import {Location} from "../../valueItems/location";
import {ILender} from "../lenders/ILender";
import {IWaitingListFactory} from "../../factories/IWaitingListFactory"
import {Person} from "../people/person"
import {LoanStatus} from "../../valueItems/loanStatus"
import {IMoney} from "../../valueItems/money/IMoney"
import {DueDate} from "../../valueItems/dueDate"
import {MoneyFactory} from "../../factories/moneyFactory"
import {IFeeSchedule} from "../../factories/IFeeSchedule"
import {BorrowerNotInGoodStanding, InvalidThingStatusToBorrow} from "../../valueItems/exceptions";


// library which also lends items from a simple, single, location
export class SimpleLibrary extends BaseLibrary implements ILender{
    private readonly _items: IThing[];
    readonly location: Location

    constructor(name: string, admin: Person, location: Location,
                waitingListFactory: IWaitingListFactory, maxFinesBeforeSuspension: IMoney, loans: Iterable<ILoan>, moneyFactory: MoneyFactory,
                feeSchedule: IFeeSchedule) {
        super(name, admin, waitingListFactory, maxFinesBeforeSuspension, loans, feeSchedule, moneyFactory);
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

    borrow(item: IThing, borrower: IBorrower, until: DueDate | undefined): ILoan {
        // check if available
        if(item.status !== ThingStatus.READY){
            throw new InvalidThingStatusToBorrow(item.status)
        }

        // check if borrower in good standing
        if(!this.canBorrow(borrower)){
            throw new BorrowerNotInGoodStanding()
        }

        if(!until){
            until = new DueDate(new Date())
        }
        //make loan
        const loan = new Loan(
            this.makeLoanId(),
            item,
            borrower,
            until,
            LoanStatus.BORROWED,
            this.location,
            undefined
        )

        item.status = ThingStatus.BORROWED
        this.addLoan(loan)
        return loan
    }

    get allTitles(): Iterable<ThingTitle> {
        return this.getTitlesFromItems(this.items)
    }

    get availableTitles(): Iterable<ThingTitle>{
        const availableItems = Array.from(this.items).filter(i => i.status === ThingStatus.READY)

        return this.getTitlesFromItems(availableItems)
    }

    preferredReturnLocation(item: IThing): Location {
        return this.location
    }

    get id(): string{
        return this.name
    }

    public startReturn(loan: ILoan): ILoan {
        return loan.startReturn()
    }
}