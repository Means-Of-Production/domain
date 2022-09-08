import {IMoney, FeeStatus} from "../../valueItems"
import {ILoan} from "../loans"

export interface ILibraryFee {
    readonly status: FeeStatus
    chargedFor: ILoan
    amount: IMoney
}