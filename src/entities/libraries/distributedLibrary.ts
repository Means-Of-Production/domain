import {IBorrower} from "../people"
import {IThing} from "../things"
import {ILoan, Loan} from "../loans"
import {
    BorrowerNotInGoodStandingError, InvalidThingStatusToBorrowError,
    TimeInterval, DueDate, ThingStatus, LoanStatus, IMoney, ILocation, PhysicalArea, MOPServer
} from "../../valueItems"
import {BaseLibrary} from "./baseLibrary"
import {Person} from "../people"
import {ILender} from "../lenders";
import {IBiddingStrategy} from "../../services"
import {MoneyFactory, IFeeSchedule, IWaitingListFactory} from "../../factories"

export class DistributedLibrary extends BaseLibrary{
    private readonly _lenders: ILender[]
    public readonly location: ILocation

    constructor(id: string, name: string, administrator: Person, maxFees: IMoney,
                waitingListFactory: IWaitingListFactory, moneyFactory: MoneyFactory,
                location: PhysicalArea, mopServer: MOPServer,
                feeSchedule?: IFeeSchedule, defaultLoanTime?: TimeInterval,
                biddingStrategy?: IBiddingStrategy) {
        super(id, name,  administrator, maxFees, moneyFactory, mopServer, defaultLoanTime, feeSchedule, biddingStrategy, waitingListFactory)

        this._lenders = []
        this.location = location
    }

    * getAllThings(): Iterable<IThing> {
        for(const lender of this._lenders){
            for(const thing of lender.items){
                yield thing
            }
        }
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