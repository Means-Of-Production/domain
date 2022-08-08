import {Person} from "./person";
import {BorrowerVerificationFlags} from "../../valueItems/borrowerVerificationFlags";
import {IBorrower} from "./IBorrower"
import {ILibraryFee} from "../libraries/ILibraryFee";
import {ILibrary} from "../libraries/ILibrary";

// this is effectively the library card
export class Borrower implements IBorrower {
    public readonly id: string
    public readonly verificationFlags: BorrowerVerificationFlags[]
    public readonly person: Person;
    private readonly _fees: ILibraryFee[]
    readonly library: ILibrary;

    constructor(id: string, person: Person, library: ILibrary, verificationFlags: BorrowerVerificationFlags[] = [],
                fees: ILibraryFee[] = []) {
        this.person = person;
        this.verificationFlags = verificationFlags
        this.library = library
        this._fees = fees
        this.id = id
    }

    get fees(): Iterable<ILibraryFee>{
        return this._fees
    }

    applyFee(fee: ILibraryFee): IBorrower {
        this._fees.push(fee)
        return this
    }

}