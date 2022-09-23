import {Person} from "./person"
import {BorrowerVerificationFlags} from "../../valueItems"
import {IBorrower} from "./IBorrower"
import {ILibraryFee, ILibrary} from "../libraries"
import {BaseEntity} from "../BaseEntity"

// this is effectively the library card
export class Borrower extends BaseEntity implements IBorrower {
    public readonly verificationFlags: BorrowerVerificationFlags[]
    public readonly person: Person;
    private readonly _fees: ILibraryFee[]
    readonly library: ILibrary;

    constructor(id: string | undefined, person: Person, library: ILibrary, verificationFlags: BorrowerVerificationFlags[] = [],
                fees: ILibraryFee[] = []) {
        super(id)
        this.person = person;
        this.verificationFlags = verificationFlags
        this.library = library
        this._fees = fees
    }

    get fees(): Iterable<ILibraryFee>{
        return this._fees
    }

    applyFee(fee: ILibraryFee): IBorrower {
        this._fees.push(fee)
        return this
    }

}