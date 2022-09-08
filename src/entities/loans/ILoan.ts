import {IBorrower} from "../people"
import {IThing} from "../things"
import {ILocation, LoanStatus, DueDate} from "../../valueItems"
import {IEntity} from "../IEntity";


export interface ILoan extends IEntity {
    readonly item: IThing
    readonly borrower: IBorrower
    readonly dueDate: DueDate
    dateReturned: Date | null
    readonly returnLocation: ILocation
    readonly active: boolean
    status: LoanStatus
    readonly permanentLoan: boolean
}