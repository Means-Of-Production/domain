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
import {FeeStatus} from "../../valueItems/feeStatus"
import {IFeeSchedule} from "../../factories/IFeeSchedule"
import {LibraryFee} from "./libraryFee"
import {BorrowerNotInGoodStanding, InvalidThingStatusToBorrow} from "../../valueItems/exceptions";


// library which also lends items from a simple, single, location
export class SimpleLibrary extends BaseLibrary implements ILender{
    private readonly _items: IThing[];
    readonly location: Location
    readonly moneyFactory: MoneyFactory
    readonly feeSchedule: IFeeSchedule

    constructor(name: string, admin: Person, location: Location,
                waitingListFactory: IWaitingListFactory, maxFinesBeforeSuspension: IMoney, loans: Iterable<ILoan>, moneyFactory: MoneyFactory,
                feeSchedule: IFeeSchedule) {
        super(name, admin, waitingListFactory, maxFinesBeforeSuspension, loans);
        this._items = []
        this.location = location
        this.moneyFactory = moneyFactory
        this.feeSchedule = feeSchedule
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
            throw new InvalidThingStatusToBorrow(item.status)
        }

        // check if borrower in good standing
        if(!this.canBorrow(borrower)){
            throw new BorrowerNotInGoodStanding()
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
        if(borrower.library.name !== this.name){
            return false
        }

        const feeAmounts = Array.from(borrower.fees).filter(f => f.status === FeeStatus.OUTSTANDING).map(f => f.amount)
        const totalFees = this.moneyFactory.total(feeAmounts)
        return !totalFees.greaterThan(this.maxFinesBeforeSuspension);
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

    public startReturn(loan: ILoan): ILoan {
        return loan.startReturn()
    }

    public finishReturn(loan: ILoan): ILoan {
        const returnedLoad = loan.finishReturn(loan.item.status)

        let feeAmount: IMoney | undefined = undefined
        if(returnedLoad.item.status == ThingStatus.DAMAGED){
            // apply the fees
            feeAmount = this.feeSchedule.feesForDamagedItem(loan)
        }

        if(returnedLoad.status == LoanStatus.OVERDUE){
            // calculate the late fee and apply
            feeAmount = this.feeSchedule.feesForOverdueItem(loan)
        }

        if(feeAmount){
            const fee = new LibraryFee(feeAmount, loan, FeeStatus.OUTSTANDING)
            loan.borrower.applyFee(fee)
        }
        return returnedLoad
    }
}