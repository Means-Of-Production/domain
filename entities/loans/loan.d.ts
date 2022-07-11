import { IThing } from "../things/IThing";
import { LoanStatus } from "../../valueItems/loanStatus";
import { IBorrower } from "../people/IBorrower";
import { Location } from "../../valueItems/location";
import { ILender } from "../lenders/ILender";
import { ILoan } from "./ILoan";
export declare class Loan implements ILoan {
    readonly id: string;
    readonly item: IThing;
    readonly borrower: IBorrower;
    readonly dueDate: Date;
    private _dateReturned;
    private _status;
    readonly returnLocation: Location;
    constructor(id: string, item: IThing, borrower: IBorrower, dueDate: Date, status?: LoanStatus, returnLocation?: Location | null, dateReturned?: Date);
    get lender(): ILender;
    get active(): boolean;
    get dateReturned(): Date | undefined;
    get status(): LoanStatus;
    startReturn(): void;
    markItemDamaged(): void;
}
