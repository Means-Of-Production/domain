import {v4 as uuidv4} from "uuid"

export class IdFactory{
    makeReservationID(): string{
        return uuidv4()
    }

    akeItemID(): string{
        return uuidv4()
    }

    makeLoanID() {
        return uuidv4()
    }
}