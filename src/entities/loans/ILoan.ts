import {IBorrower} from "../people/IBorrower"
import {IThing} from "../things/IThing"
import {Location} from "../../valueItems/location"
import {LoanStatus} from "../../valueItems/loanStatus";
import {DueDate} from "../../valueItems/dueDate";


export interface ILoan {
    readonly id: string
    readonly item: IThing
    readonly borrower: IBorrower
    readonly dueDate: DueDate
    dateReturned: Date | null
    readonly returnLocation: Location
    readonly active: boolean
    status: LoanStatus
    readonly permanentLoan: boolean
}