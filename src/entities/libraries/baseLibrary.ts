import {ILibrary} from "./ILibrary";
import {IThing} from "../things/IThing";
import {IBorrower} from "../people/IBorrower";
import {ILoan} from "../loans/ILoan";
import {ThingTitle} from "../../valueItems/thingTitle";
import {IWaitingListFactory} from "../../factories/IWaitingListFactory";
import {IWaitingList} from "../waitingLists/IWaitingList";
import {Person} from "../people/person";
import {IMoney} from "../../valueItems/money/IMoney";
import {DueDate} from "../../valueItems/dueDate";
import {IFeeSchedule} from "../../factories/IFeeSchedule";
import {ThingStatus} from "../../valueItems/thingStatus";
import {LoanStatus} from "../../valueItems/loanStatus";
import {LibraryFee} from "./libraryFee";
import {FeeStatus} from "../../valueItems/feeStatus";
import {MoneyFactory} from "../../factories/moneyFactory";

export abstract class BaseLibrary implements ILibrary{
    private readonly _borrowers: IBorrower[]
    private readonly _loans: ILoan[]
    readonly name: string;
    readonly waitingListFactory: IWaitingListFactory
    readonly waitingListsByItemId: Map<string, IWaitingList>
    readonly administrator: Person;
    readonly maxFinesBeforeSuspension: IMoney
    readonly feeSchedule: IFeeSchedule
    readonly moneyFactory: MoneyFactory

    protected constructor(name: string, administrator: Person, waitingListFactory: IWaitingListFactory, maxFinesBeforeSuspension: IMoney, loans: Iterable<ILoan>, feeSchedule: IFeeSchedule, moneyFactory: MoneyFactory) {
        this.name = name;
        this.waitingListFactory = waitingListFactory
        this._borrowers = []
        this.administrator = administrator
        this.waitingListsByItemId= new Map<string, IWaitingList>()
        this.maxFinesBeforeSuspension = maxFinesBeforeSuspension
        this.feeSchedule = feeSchedule
        this.moneyFactory = moneyFactory

        this._loans = []
        for(const l of loans){
            this._loans.push(l)
        }
    }

    abstract get allTitles(): Iterable<ThingTitle>
    abstract get availableTitles(): Iterable<ThingTitle>

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
        let list: IWaitingList | undefined = this.waitingListsByItemId.get(item.id)
        if(!list){
            list = this.waitingListFactory.createList(item)
            this.waitingListsByItemId.set(item.id, list)
        }
        list.add(borrower)
        return list
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

    protected makeLoanId(): string{
        return "guid"
    }

    private static compareLoans(a: ILoan, b: ILoan): number {
        return DueDate.compare(a.dueDate, b.dueDate)
    }

    protected getBidForCost(item: IThing, borrower: IBorrower, amountToPay: IMoney): IMoney{
        // get loans for the item
        const itemLoans = this._loans
            .filter(l => l.item.id == item.id)
            .sort(BaseLibrary.compareLoans)

        // find how many times consecutively this borrower has borrowed this item
        let numPreviousLoans = 0
        for(const l of itemLoans){
            if(l.borrower.id == borrower.id){
                numPreviousLoans += 1
            } else {
                break;
            }
        }

        // multiple effective rate times this
        return numPreviousLoans > 0 ? amountToPay.multiply(1/numPreviousLoans) : amountToPay
    }

    public finishReturn(loan: ILoan): ILoan {
        // this has to call FIRST, so the status can be updated to act here
        loan.finishReturn();
        let feeAmount: IMoney | undefined = undefined
        if(loan.item.status == ThingStatus.DAMAGED){
            // apply the fees
            feeAmount = this.feeSchedule.feesForDamagedItem(loan)
        }

        if(loan.status == LoanStatus.OVERDUE){
            // calculate the late fee and apply
            feeAmount = this.feeSchedule.feesForOverdueItem(loan)
            loan.item.status = ThingStatus.READY
        }

        if(feeAmount){
            const fee = new LibraryFee(feeAmount, loan, FeeStatus.OUTSTANDING)
            loan.borrower.applyFee(fee)
        } else {
            loan.item.status = ThingStatus.READY
        }

        // TODO is there a waiting list for the item?
        return loan
    }
}