import {BorrowerVerificationFlags} from "../../valueItems/borrowerVerificationFlags"
import {ILibrary} from "../libraries/ILibrary";
import {ILibraryFee} from "../libraries/ILibraryFee";
import {Person} from "./person";
import {IEntity} from "../IEntity";

// this is the equivalent of a library card
export interface IBorrower extends IEntity {
    readonly person: Person
    readonly library: ILibrary
    readonly verificationFlags: Iterable<BorrowerVerificationFlags>
    readonly fees: Iterable<ILibraryFee>

    applyFee(fee: ILibraryFee): IBorrower
}