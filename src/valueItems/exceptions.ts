import { ThingStatus} from "./thingStatus";
import { BorrowerVerificationFlags} from "./borrowerVerificationFlags";

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
        super(`Invalid state transition requested from ${from} to ${to}`);
    }
}