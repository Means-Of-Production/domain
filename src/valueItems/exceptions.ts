import { ThingStatus} from "./thingStatus";
import { BorrowerVerificationFlags} from "./borrowerVerificationFlags";
import {LoanStatus} from "./loanStatus";
import {ReservationStatus} from "./reservationStatus";

export class InsufficentBorrowerVerificationFlagError extends Error{
    public readonly flag: BorrowerVerificationFlags

    constructor(flag: BorrowerVerificationFlags) {
        super(`User does not have ${flag} but item requires it`)
        this.flag = flag
    }
}

export class InvalidThingStatusToBorrowError extends Error{
    public readonly status: ThingStatus

    constructor(status: ThingStatus) {
        super(`Attempting to borrow a thing with status of ${status}`);
        this.status = status
    }
}

export class ReturnNotStartedError extends Error {}

export class BorrowerNotInGoodStandingError extends Error{

}
export class DifferentTypesOfMoneyError extends Error{}

export class InvalidThingStateTransitionError extends Error {
    constructor(from: ThingStatus, to: ThingStatus) {
        super(`Invalid Thing state transition requested from ${ThingStatus[from]} to ${ThingStatus[to]}`);
    }
}

export class InvalidLoanStateTransitionError extends Error {
    constructor(from: LoanStatus, to: LoanStatus) {
        super(`Invalid Loan state transition requested from ${LoanStatus[from]} to ${LoanStatus[to]}`);
    }
}

export class InvalidReservationStateTransitionError extends Error {
    constructor(from: ReservationStatus, to: ReservationStatus) {
        super(`Invalid ReservationStatus requested from ${from} to ${to}`);
    }
}

export class InvalidLibraryConfigurationError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class EntityNotAssignedIdError extends Error {
    constructor(message: string){
        super(message);
    }
}

export class InvalidLocationTypeError extends Error {
    constructor(requiredLocationType: string, given: string) {
        super(`Requires a location type of ${requiredLocationType}, but was given ${given}`)
    }
}