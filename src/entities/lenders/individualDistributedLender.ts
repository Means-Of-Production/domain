import {ILoan} from "../loans/ILoan";
import {Person} from "../people/person";
import {ILender} from "./ILender";
import {IThing} from "../things/IThing";
import {EmailAddress} from "../../valueItems/emailAddress";
import {Location} from "../../valueItems/location";
import {ThingStatus} from "../../valueItems/thingStatus";

/*
Class to represent the lenders in a distributed library
 */
export class IndividualDistributedLender implements ILender{
    private readonly _items: Iterable<IThing>
    readonly person: Person
    readonly id: string
    private readonly _returnLocationOverride: Location | undefined

    constructor(id: string, person: Person, emails: EmailAddress[] = [], items: Iterable<IThing>, returnLocationOverride?: Location){
        this.id = id
        this.person = person
        this._items = items
        this._returnLocationOverride = returnLocationOverride
    }

    startReturn(loan: ILoan): ILoan{
        // mark that we've started to return this item
        loan.item.status = ThingStatus.RETURNING
        return loan
    }

    finishReturn(loan: ILoan): ILoan {
        // todo - see the user actions to determine the status
        if(loan.item.status == ThingStatus.DAMAGED){

        }
        return loan
    }

    get items(): Iterable<IThing> {
        return this._items
    }

    preferredReturnLocation(item: IThing): Location{
        if (this._returnLocationOverride){ return this._returnLocationOverride}
        return item.storageLocation
    }
}
