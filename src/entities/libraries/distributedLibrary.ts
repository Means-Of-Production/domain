import {IBorrower} from "../people"
import {IThing} from "../things"
import {ILoan, Loan} from "../loans"
import {BorrowerNotInGoodStandingError, InvalidThingStatusToBorrowError,
    TimeInterval, DueDate, ThingTitle, ThingStatus, LoanStatus, IMoney} from "../../valueItems"
import {BaseLibrary} from "./baseLibrary"
import {Person} from "../people"
import {ILender} from "../lenders";
import {QuadraticBiddingStrategy} from "../../services"
import {MoneyFactory, IFeeSchedule, IWaitingListFactory} from "../../factories"

export class DistributedLibrary extends BaseLibrary{
    private readonly _lenders: ILender[]

    constructor(name: string, administrator: Person, maxFees: IMoney, waitingListFactory: IWaitingListFactory, loans: Iterable<ILoan>, feeSchedule: IFeeSchedule, moneyFactory: MoneyFactory, defaultLoanTime: TimeInterval) {
        const biddingStrategy = new QuadraticBiddingStrategy(loans);
        super(name,  administrator, maxFees, loans, feeSchedule, moneyFactory, defaultLoanTime, biddingStrategy, waitingListFactory)

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
            throw new InvalidThingStatusToBorrowError(item.status)
        }

        // check if borrower in good standing
        if(!this.canBorrow(borrower)){
            throw new BorrowerNotInGoodStandingError()
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
            undefined,
            item,
            borrower,
            until,
            LoanStatus.BORROWED,
            lender.preferredReturnLocation(item),
            null
        )
    }

    get availableTitles(): Iterable<ThingTitle> {
        const items = this._lenders.flatMap(l => Array.from(l.items)).filter(i => i.status === ThingStatus.READY);
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