import {IThing} from "../things/IThing";
import {LoanStatus} from "../../valueItems/loanStatus";
import {IBorrower} from "../people/IBorrower";
import {Location} from "../../valueItems/location";
import {ILender} from "../lenders/ILender";
import {ThingStatus} from "../../valueItems/thingStatus";
import {ILoan} from "./ILoan"
import {DueDate} from "../../valueItems/dueDate";
import {ReturnNotStarted} from "../../valueItems/exceptions";

export class Loan implements ILoan {
    public readonly id: string
    public readonly item: IThing
    public readonly borrower: IBorrower
    public readonly dueDate: DueDate
    private _dateReturned: Date | undefined
    private _status: LoanStatus
    public readonly returnLocation: Location

    public constructor(id: string, item: IThing, borrower: IBorrower, dueDate: DueDate, status: LoanStatus = LoanStatus.BORROWED,
                       returnLocation: Location | null = null, dateReturned?: Date) {
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
    public get dateReturned(): Date | undefined{
        return this._dateReturned
    }
    public get status(): LoanStatus {
        return this._status
    }

    public startReturn(): ILoan {
        this._status = LoanStatus.RETURN_STARTED
        this._dateReturned = new Date()
        return this
    }

    public finishReturn(): ILoan {
        if(this.status !== LoanStatus.RETURN_STARTED){
            throw new ReturnNotStarted()
        }

        if(this.item.status === ThingStatus.DAMAGED){
            this._status = LoanStatus.RETURNED_DAMAGED
            return this
        }
        if(this._dateReturned) {
            if (this.dueDate.date) {
                if(this._dateReturned > this.dueDate.date){
                    this._status = LoanStatus.OVERDUE
                    return this
                }
            }
        }
        this._status = LoanStatus.RETURNED
        return this

    }

    public get permanentLoan(): boolean{
        return !this.dueDate.date
    }
}