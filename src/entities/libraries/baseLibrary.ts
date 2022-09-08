import {ILibrary} from "./ILibrary"
import {IThing} from "../things"
import {IBorrower, Person} from "../people"
import {ILoan} from "../loans"
import {IFeeSchedule, IWaitingListFactory, MoneyFactory, WaitingListFactory} from "../../factories"
import {IAuctionableWaitingList, IWaitingList} from "../waitingLists"
import {LibraryFee} from "./libraryFee"
import {
    DueDate,
    EntityNotAssignedIdError,
    FeeStatus, ILocation,
    IMoney,
    InvalidLibraryConfigurationError,
    LoanStatus,
    ReturnNotStartedError,
    ThingStatus,
    ThingTitle,
    TimeInterval
} from "../../valueItems"
import {IBiddingStrategy} from "../../services"

export abstract class BaseLibrary implements ILibrary{
    private readonly _borrowers: IBorrower[]
    private readonly _loans: ILoan[]
    readonly name: string;
    readonly id: string | undefined
    readonly waitingListFactory: IWaitingListFactory
    readonly waitingListsByItemId: Map<string, IWaitingList>
    readonly administrator: Person;
    readonly maxFinesBeforeSuspension: IMoney
    readonly feeSchedule: IFeeSchedule
    readonly moneyFactory: MoneyFactory
    readonly defaultLoanTime: TimeInterval
    readonly biddingStrategy?: IBiddingStrategy

    protected constructor(name: string, administrator: Person,
                          maxFinesBeforeSuspension: IMoney, loans: Iterable<ILoan>, feeSchedule: IFeeSchedule,
                          moneyFactory: MoneyFactory, defaultLoanTime: TimeInterval,
                          biddingStrategy?: IBiddingStrategy, waitingListFactory?: IWaitingListFactory
    ) {
        this.name = name;
        this._borrowers = []
        this.administrator = administrator
        this.waitingListsByItemId= new Map<string, IWaitingList>()
        this.maxFinesBeforeSuspension = maxFinesBeforeSuspension
        this.feeSchedule = feeSchedule
        this.moneyFactory = moneyFactory
        this.defaultLoanTime = defaultLoanTime

        this._loans = []
        for(const l of loans){
            this._loans.push(l)
        }

        if(!waitingListFactory){
            waitingListFactory = new WaitingListFactory(biddingStrategy != undefined, undefined, moneyFactory)
        } else {
            if(waitingListFactory.supportsAuctions && !this.biddingStrategy){
                throw new InvalidLibraryConfigurationError("Waiting list supports auctions but no bidding strategy provided!")
            }
            if(!waitingListFactory.supportsAuctions && this.biddingStrategy){
                throw new InvalidLibraryConfigurationError("Waiting list does not support auctions but bidding strategy provided!")
            }
        }
        this.waitingListFactory = waitingListFactory
        this.biddingStrategy = biddingStrategy
    }

    abstract get location(): ILocation
    abstract getAllThings(): Iterable<IThing>

    * getAvailableThings(): Iterable<IThing> {
        for(const thing of this.getAllThings()){
            if(thing.status === ThingStatus.READY){
                yield thing
            }
        }
    }

    abstract borrow(item: IThing, borrower: IBorrower, until: DueDate): ILoan

    abstract startReturn(loan:ILoan): ILoan

    public get borrowers(): Iterable<IBorrower>{
        return this._borrowers
    }

    public addBorrower(borrower: IBorrower): IBorrower{
        this._borrowers.push(borrower)
        return borrower
    }

    canBorrow(borrower: IBorrower): boolean {
        if(borrower.library.name !== this.name){
            return false
        }

        const feeAmounts = Array.from(borrower.fees).filter(f => f.status === FeeStatus.OUTSTANDING).map(f => f.amount)
        const totalFees = this.moneyFactory.total(feeAmounts)
        return !totalFees.greaterThan(this.maxFinesBeforeSuspension);
    }

    public reserveItem(item: IThing, borrower: IBorrower): IWaitingList {
        if(!item.id){
            throw new EntityNotAssignedIdError("")
        }
        let list: IWaitingList | undefined = this.waitingListsByItemId.get(item.id)
        if(!list){
            list = this.waitingListFactory.createList(item)
            this.waitingListsByItemId.set(item.id, list)
        }
        list.add(borrower)
        return list
    }

    public getLoans(): Iterable<ILoan> {
        return this._loans
    }
    
    public addLoan(loan: ILoan){
        this._loans.push(loan)
    }

    protected getTitlesFromItems(items: Iterable<IThing>): Iterable<ThingTitle>{
        const titles = []
        for (const item of items){
            const existing = titles.filter(t => t.equals(item.title))
            if(existing.length === 0){
                titles.push(item.title)
            }
        }

        return titles
    }

    public finishReturn(loan: ILoan): ILoan {
        // this has to call FIRST, so the status can be updated to act here
        if(loan.status !== LoanStatus.WAITING_ON_LENDER_ACCEPTANCE || !loan.dateReturned){
            throw new ReturnNotStartedError()
        }

        if(loan.item.status === ThingStatus.DAMAGED){
            loan.status = LoanStatus.RETURNED_DAMAGED
        } else {
            if (loan.dueDate.date) {
                if (loan.dateReturned > loan.dueDate.date) {
                    loan.status = LoanStatus.OVERDUE
                } else{
                    loan.status = LoanStatus.RETURNED
                }
            } else {
                // should we be able to return things without a date?
                loan.status = LoanStatus.RETURNED
            }
        }


        let feeAmount: IMoney | undefined = undefined
        if(loan.item.status == ThingStatus.DAMAGED){
            // apply the fees
            feeAmount = this.feeSchedule.feesForDamagedItem(loan)
        }

        if(loan.status == LoanStatus.OVERDUE){
            // calculate the late fee and apply
            feeAmount = this.feeSchedule.feesForOverdueItem(loan)
        }
        if(feeAmount){
            const fee = new LibraryFee(feeAmount, loan, FeeStatus.OUTSTANDING)
            loan.borrower.applyFee(fee)
        }

        // is there a waiting list for the item?
        if(!loan.item.id){
            throw new EntityNotAssignedIdError("")
        }
        if(this.waitingListsByItemId.has(loan.item.id)){
            const waitingList = this.waitingListsByItemId.get(loan.item.id);
            if(waitingList) {
                waitingList.reserveItemForNextBorrower()
            }
        }

        if(loan.item.status === ThingStatus.BORROWED) {
            loan.item.status = ThingStatus.READY
        }
        return loan
    }

    public bidToSkipToFrontOfList(item: IThing, bidder: IBorrower, amount: IMoney, borrower: IBorrower): IWaitingList{
        if(!this.biddingStrategy){
            throw new InvalidLibraryConfigurationError("This library does not support bidding!")
        }
        const waitingList = this.reserveItem(item, borrower)
        const auctionableList = waitingList as IAuctionableWaitingList

        const bid = this.biddingStrategy?.getBidForCost(item, bidder, amount, borrower)
        return auctionableList.addBid(bid)
    }
}