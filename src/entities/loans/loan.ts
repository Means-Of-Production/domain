import {IThing} from "../things/IThing";
import {LoanStatus} from "../../valueItems/loanStatus";
import {IBorrower} from "../people/IBorrower";
import {PhysicalLocation} from "../../valueItems/physicalLocation";
import {ILender} from "../lenders/ILender";
import {ILoan} from "./ILoan"
import {DueDate} from "../../valueItems/dueDate";
import {InvalidLoanStateTransitionError} from "../../valueItems/exceptions";

export class Loan implements ILoan {
    public readonly id: string | undefined
    public readonly item: IThing
    public readonly borrower: IBorrower
    public readonly dueDate: DueDate
    private _dateReturned: Date | null
    private _status: LoanStatus
    public readonly returnLocation: PhysicalLocation

    public constructor(id: string | undefined, item: IThing, borrower: IBorrower, dueDate: DueDate, status: LoanStatus = LoanStatus.BORROWED,
                       returnLocation: PhysicalLocation | null = null, dateReturned: Date | null = null) {
        this.id = id
        this.item = item
        this.borrower = borrower
        this.dueDate = dueDate
        this._status = status
        if(returnLocation){
            this.returnLocation = returnLocation
        } else {
            this.returnLocation = item.storageLocation
        }
        this._dateReturned = dateReturned
    }

    public get lender(): ILender {
        return this.item.owner
    }

    public get active(): boolean {
        return this._status === LoanStatus.BORROWED
    }

    public get dateReturned(): Date | null{
        return this._dateReturned
    }

    public set dateReturned(date: Date | null){
        this._dateReturned = date

    }
    public get status(): LoanStatus {
        return this._status
    }

    public set status(status: LoanStatus) {
        let validNewStatus: LoanStatus[]
        switch(this._status){
            case LoanStatus.BORROWED:
                validNewStatus = [LoanStatus.RETURN_STARTED, LoanStatus.OVERDUE]
                break
            case LoanStatus.OVERDUE:
                validNewStatus = [LoanStatus.RETURN_STARTED]
                break
            case LoanStatus.RETURN_STARTED:
                validNewStatus = [LoanStatus.WAITING_ON_LENDER_ACCEPTANCE, LoanStatus.RETURNED, LoanStatus.RETURNED_DAMAGED]
                break
            case LoanStatus.WAITING_ON_LENDER_ACCEPTANCE:
                validNewStatus = [LoanStatus.RETURNED, LoanStatus.RETURNED_DAMAGED, LoanStatus.OVERDUE]
                break
            case LoanStatus.RETURNED_DAMAGED:
            case LoanStatus.RETURNED:
                validNewStatus = []
                break
        }

        if(validNewStatus.indexOf(status) < 0){
            throw new InvalidLoanStateTransitionError(this._status, status);
        }
        this._status = status
    }

    public get permanentLoan(): boolean{
        return !this.dueDate.date
    }
}