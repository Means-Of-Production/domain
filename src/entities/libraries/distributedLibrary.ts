import {IMoney} from "../../valueItems/money/IMoney";
import {IBorrower} from "../people/IBorrower";
import {IThing} from "../things/IThing";
import {ThingStatus} from "../../valueItems/thingStatus";
import {ILoan} from "../loans/ILoan";
import {Loan} from "../loans/loan"
import {LoanStatus} from "../../valueItems/loanStatus";
import {IndividualDistributedLender} from "../lenders/individualDistributedLender";
import {InvalidThingStatusToBorrow, NotImplemented} from "../../valueItems/exceptions";
import {ThingTitle} from "../../valueItems/thingTitle";
import {BaseLibrary} from "./baseLibrary";
import {IWaitingListFactory} from "../../factories/IWaitingListFactory";
import {Person} from "../people/person";
import {DueDate} from "../../valueItems/dueDate";
import {IFeeSchedule} from "../../factories/IFeeSchedule";

export class DistributedLibrary extends BaseLibrary{
    private readonly _lenders: IndividualDistributedLender[]

    constructor(name: string, administrator: Person, maxFees: IMoney, lenders: IndividualDistributedLender[], waitingListFactory: IWaitingListFactory, loans: Iterable<ILoan>, feeSchedule: IFeeSchedule) {
        super(name,  administrator, waitingListFactory, maxFees, loans, feeSchedule)

        this._lenders = lenders
    }

    public canBorrow(borrower: IBorrower): boolean {
        for(const b of this.borrowers){
            if(b.id === borrower.id){
                // in the lib, for now that's enough
                return true
            }
        }
        return false
    }

    get allTitles(): Iterable<ThingTitle> {
        const items = []
        for (const lender of this._lenders) {
            for (const item of lender.items) {
                items.push(item)
            }
        }

        return this.getTitlesFromItems(items)

    }

    private getOwnerOfItem(item: IThing): IndividualDistributedLender {
        for (const lender of this._lenders){
            for (const lenderItem of lender.items){
                if (item.id === lenderItem.id){
                    return lender
                }
            }
        }
        throw new Error()
    }

    borrow(item: IThing, borrower: IBorrower, until: DueDate): ILoan {
        if (item.status === ThingStatus.DAMAGED) {
            throw new InvalidThingStatusToBorrow(item.status)
        }
        // get the lender for this item
        const lender = this.getOwnerOfItem(item)
        if (!lender){
            throw new Error(`Cannot find owner of item ${item.id}`)
        }
        return new Loan(
            this.makeLoanId(),
            item,
            borrower,
            until,
            LoanStatus.LOANED,
            lender.preferredReturnLocation(item)
        )
    }

    get availableTitles(): Iterable<ThingTitle> {
        throw new NotImplemented()
    }

    finishReturn(loan: ILoan): ILoan {
        // if the lender has marked this as damaged, assess a fine
        const lender = this.getOwnerOfItem(loan.item)
        const fromLender = lender.finishReturn(loan)

        return this.createFee(fromLender)
    }

    startReturn(loan: ILoan): ILoan {
        // fire it to the lender
        const lender = this.getOwnerOfItem(loan.item)
        return lender.startReturn(loan)
    }
}