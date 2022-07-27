import {IMoney} from "../../valueItems/money/IMoney";
import {IBorrower} from "../people/IBorrower";
import {IThing} from "../things/IThing";
import {ThingStatus} from "../../valueItems/thingStatus";
import {ILoan} from "../loans/ILoan";
import {Loan} from "../loans/loan"
import {LoanStatus} from "../../valueItems/loanStatus";
import {BorrowerNotInGoodStanding, InvalidThingStatusToBorrow} from "../../valueItems/exceptions";
import {ThingTitle} from "../../valueItems/thingTitle";
import {BaseLibrary} from "./baseLibrary";
import {IWaitingListFactory} from "../../factories/IWaitingListFactory";
import {Person} from "../people/person";
import {DueDate} from "../../valueItems/dueDate";
import {IFeeSchedule} from "../../factories/IFeeSchedule";
import {ILender} from "../lenders/ILender";
import {MoneyFactory} from "../../factories/moneyFactory";
import {IdFactory} from "../../factories/idFactory";
import {TimeInterval} from "../../valueItems/timeInterval";

export class DistributedLibrary extends BaseLibrary{
    private readonly _lenders: ILender[]

    constructor(name: string, administrator: Person, maxFees: IMoney, waitingListFactory: IWaitingListFactory, loans: Iterable<ILoan>, feeSchedule: IFeeSchedule, moneyFactory: MoneyFactory, idFactory: IdFactory, defaultLoanTime: TimeInterval) {
        super(name,  administrator, waitingListFactory, maxFees, loans, feeSchedule, moneyFactory, idFactory, defaultLoanTime)

        this._lenders = []
    }

    get allTitles(): Iterable<ThingTitle> {
        const items = this._lenders.flatMap(l => Array.from(l.items));
        return this.getTitlesFromItems(items)

    }

    private getOwnerOfItem(item: IThing): ILender {
        for (const lender of this._lenders){
            for (const lenderItem of lender.items){
                if (item.id === lenderItem.id){
                    return lender
                }
            }
        }
        throw new Error(`Cannot find an owner for ${item.title.name}`)
    }

    borrow(item: IThing, borrower: IBorrower, until: DueDate | undefined): ILoan {
        if (item.status !== ThingStatus.READY) {
            throw new InvalidThingStatusToBorrow(item.status)
        }

        // check if borrower in good standing
        if(!this.canBorrow(borrower)){
            throw new BorrowerNotInGoodStanding()
        }

        // get the lender for this item
        const lender = this.getOwnerOfItem(item)
        if (!lender){
            throw new Error(`Cannot find owner of item ${item.id}`)
        }

        if(!until){
            until = new DueDate(this.defaultLoanTime.fromNow())
        }

        item.status = ThingStatus.BORROWED;
        return new Loan(
            this.idFactory.makeLoanID(),
            item,
            borrower,
            until,
            LoanStatus.BORROWED,
            lender.preferredReturnLocation(item),
            null
        )
    }

    get availableTitles(): Iterable<ThingTitle> {
        const items = this._lenders.flatMap(l => Array.from(l.items)).filter(i => i.status == ThingStatus.READY);
        return this.getTitlesFromItems(items);
    }

    finishReturn(loan: ILoan): ILoan {
        const owner = this.getOwnerOfItem(loan.item);
        const fromOwner = owner.finishReturn(loan);
        return super.finishReturn(fromOwner);
    }

    startReturn(loan: ILoan): ILoan {
        // TODO check the borrower is somewhere near where they should be!
        const owner = this.getOwnerOfItem(loan.item);
        const updated = owner.startReturn(loan);

        loan.dateReturned = new Date()
        // TODO notify the owner that we have started the return

        loan.status = LoanStatus.WAITING_ON_LENDER_ACCEPTANCE
        return updated
    }

    addLender(lender: ILender) : ILender {
        this._lenders.push(lender)
        return lender
    }
}