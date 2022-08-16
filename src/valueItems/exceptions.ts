import { ThingStatus} from "./thingStatus";
import { BorrowerVerificationFlags} from "./borrowerVerificationFlags";
import {LoanStatus} from "./loanStatus";
import {ReservationStatus} from "./reservationStatus";

export class InsufficentBorrowerVerificationFlag extends Error{
    public readonly flag: BorrowerVerificationFlags

    constructor(flag: BorrowerVerificationFlags) {
        super(`User does not have ${flag} but item requires it`)
        this.flag = flag
    }
}

export class InvalidThingStatusToBorrow extends Error{
    public readonly status: ThingStatus

    constructor(status: ThingStatus) {
        super(`Attempting to borrow a thing with status of ${status}`);
        this.status = status
    }
}

export class ReturnNotStarted extends Error {}

export class BorrowerNotInGoodStanding extends Error{

}
export class DifferentTypesOfMoney extends Error{}

export class NotImplemented extends Error{
    constructor() {
        super("Not Implemented");
    }
}

export class InvalidThingStateTransition extends Error {
    constructor(from: ThingStatus, to: ThingStatus) {
        super(`Invalid Thing state transition requested from ${ThingStatus[from]} to ${ThingStatus[to]}`);
    }
}

export class InvalidLoanStateTransition extends Error {
    constructor(from: LoanStatus, to: LoanStatus) {
        super(`Invalid Loan state transition requested from ${LoanStatus[from]} to ${LoanStatus[to]}`);
    }
}

export class InvalidReservationStateTransition extends Error {
    constructor(from: ReservationStatus, to: ReservationStatus) {
        super(`Invalid ReservationStatus requested from ${from} to ${to}`);
    }
}

export class InvalidLibraryConfiguration extends Error {
    constructor(message: string) {
        super(message);
    }
}