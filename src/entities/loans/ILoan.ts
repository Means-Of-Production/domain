import {IBorrower} from "../people/IBorrower"
import {IThing} from "../things/IThing"
import {PhysicalLocation} from "../../valueItems/physicalLocation"
import {LoanStatus} from "../../valueItems/loanStatus";
import {DueDate} from "../../valueItems/dueDate";


export interface ILoan {
    readonly id: string
    readonly item: IThing
    readonly borrower: IBorrower
    readonly dueDate: DueDate
    dateReturned: Date | null
    readonly returnLocation: PhysicalLocation
    readonly active: boolean
    status: LoanStatus
    readonly permanentLoan: boolean
}