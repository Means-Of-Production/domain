import { Person } from "./person";
import { BorrowerVerificationFlags } from "../../valueItems/borrowerVerificationFlags";
import { IBorrower } from "./IBorrower";
import { ILibraryFee } from "../libraries/ILibraryFee";
import { ILibrary } from "../libraries/ILibrary";
export declare class Borrower implements IBorrower {
    readonly id: string;
    readonly verificationFlags: BorrowerVerificationFlags[];
    readonly person: Person;
    constructor(id: string, person: Person, library: ILibrary, verificationFlags?: BorrowerVerificationFlags[], fees?: ILibraryFee[]);
    readonly fees: Iterable<ILibraryFee>;
    readonly library: ILibrary;
}
