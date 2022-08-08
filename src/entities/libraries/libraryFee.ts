import {ILibraryFee} from "./ILibraryFee";
import {IMoney} from "../../valueItems/money/IMoney";
import {ILoan} from "../loans/ILoan";
import {FeeStatus} from "../../valueItems/feeStatus";

export class LibraryFee implements ILibraryFee{
    readonly amount: IMoney;
    readonly chargedFor: ILoan;
    readonly status: FeeStatus;

    constructor(amount: IMoney, chargedFor: ILoan, status: FeeStatus) {
        this.amount = amount
        this.chargedFor = chargedFor
        this.status = status
    }
}