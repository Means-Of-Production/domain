import {IMoney} from "../../valueItems/money/IMoney";
import {ILoan} from "../loans/ILoan";
import {FeeStatus} from "../../valueItems/feeStatus";

export interface ILibraryFee {
    readonly status: FeeStatus
    chargedFor: ILoan
    amount: IMoney
}