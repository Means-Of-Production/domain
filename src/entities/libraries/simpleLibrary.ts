import {IThing} from "../things/IThing";
import {IBorrower} from "../people/IBorrower";
import {ILoan} from "../loans/ILoan";
import {BaseLibrary} from "./baseLibrary"
import {ThingTitle} from "../../valueItems/thingTitle";
import {ThingStatus} from "../../valueItems/thingStatus";
import {Loan} from "../loans/loan";
import {PhysicalLocation} from "../../valueItems/location";
import {ILender} from "../lenders/ILender";
import {IWaitingListFactory} from "../../factories/IWaitingListFactory"
import {Person} from "../people/person"
import {LoanStatus} from "../../valueItems/loanStatus"
import {IMoney} from "../../valueItems/money/IMoney"
import {DueDate} from "../../valueItems/dueDate"
import {MoneyFactory} from "../../factories/moneyFactory"
import {IFeeSchedule} from "../../factories/IFeeSchedule"
import {BorrowerNotInGoodStandingError, InvalidThingStatusToBorrowError} from "../../valueItems/exceptions";
import {TimeInterval} from "../../valueItems/timeInterval";
import {QuadraticBiddingStrategy} from "../../services/bidding/quadraticBiddingStrategy";


// library which also lends items from a simple, single, location
export class SimpleLibrary extends BaseLibrary implements ILender{
    private readonly _items: IThing[];
    readonly location: PhysicalLocation

    constructor(name: string, admin: Person, location: PhysicalLocation,
                waitingListFactory: IWaitingListFactory, maxFinesBeforeSuspension: IMoney, loans: Iterable<ILoan>, moneyFactory: MoneyFactory,
                feeSchedule: IFeeSchedule, defaultLoanTime?: TimeInterval) {
        if(!defaultLoanTime){
            defaultLoanTime = TimeInterval.fromDays(14)
        }
        const biddingStrategy = new QuadraticBiddingStrategy(loans);
        super(name, admin, maxFinesBeforeSuspension, loans, feeSchedule, moneyFactory, defaultLoanTime, biddingStrategy, waitingListFactory);
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
            throw new InvalidThingStatusToBorrowError(item.status)
        }

        // check if borrower in good standing
        if(!this.canBorrow(borrower)){
            throw new BorrowerNotInGoodStandingError()
        }

        if(!until){
            until = new DueDate(this.defaultLoanTime.fromNow())
        }
        //make loan
        const loan = new Loan(
            undefined,
            item,
            borrower,
            until,
            LoanStatus.BORROWED,
            this.location,
            null
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

    preferredReturnLocation(item: IThing): PhysicalLocation {
        return this.location
    }

    public startReturn(loan: ILoan): ILoan {
        // simple library does not have an acceptance step, only the library starts returns!
        loan.status = LoanStatus.RETURN_STARTED
        loan.status = LoanStatus.WAITING_ON_LENDER_ACCEPTANCE
        loan.dateReturned = new Date()
        return loan
    }
}