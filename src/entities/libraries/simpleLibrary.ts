import {IThing} from "../things";
import {IBorrower} from "../people";
import {ILoan, Loan} from "../loans";
import {BaseLibrary} from "./baseLibrary"
import {ThingTitle, ThingStatus, PhysicalLocation, MOPServer} from "../../valueItems"
import {ILender} from "../lenders";
import {IWaitingListFactory} from "../../factories"
import {Person} from "../people"
import {LoanStatus} from "../../valueItems"
import {IMoney} from "../../valueItems"
import {DueDate} from "../../valueItems"
import {MoneyFactory} from "../../factories"
import {IFeeSchedule} from "../../factories"
import {BorrowerNotInGoodStandingError, InvalidThingStatusToBorrowError} from "../../valueItems";
import {TimeInterval} from "../../valueItems";
import {IBiddingStrategy, QuadraticBiddingStrategy} from "../../services"


// library which also lends items from a simple, single, location
export class SimpleLibrary extends BaseLibrary implements ILender{
    private readonly _items: IThing[];
    readonly location: PhysicalLocation

    constructor(id: string, name: string, admin: Person, location: PhysicalLocation,
                waitingListFactory: IWaitingListFactory, maxFinesBeforeSuspension: IMoney, loans: Iterable<ILoan>,
                moneyFactory: MoneyFactory,
                mopServer: MOPServer,
                feeSchedule?: IFeeSchedule,
                defaultLoanTime?: TimeInterval,
                biddingStrategy?: IBiddingStrategy) {
        if(!defaultLoanTime){
            defaultLoanTime = TimeInterval.fromDays(14)
        }
        super(id, name, admin, maxFinesBeforeSuspension, loans, moneyFactory, mopServer, defaultLoanTime, feeSchedule, biddingStrategy, waitingListFactory);
        this._items = []
        this.location = location
    }

    addItem(item: IThing): IThing{
        this._items.push(item)
        return item
    }

    getAllThings(): Iterable<IThing> {
        return this._items
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