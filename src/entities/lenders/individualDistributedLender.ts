import {ILoan} from "../loans/ILoan";
import {Person} from "../people/person";
import {ILender} from "./ILender";
import {IThing} from "../things/IThing";
import {EmailAddress} from "../../valueItems/emailAddress";
import {Location} from "../../valueItems/location";

/*
Class to represent the lenders in a distributed library
 */
export class IndividualDistributedLender implements ILender{
    private readonly _items: IThing[]
    readonly person: Person
    readonly id: string
    private readonly _returnLocationOverride: Location | undefined

    constructor(id: string, person: Person, emails: EmailAddress[] = [], items: Iterable<IThing>, returnLocationOverride?: Location){
        this.id = id
        this.person = person
        this._items = []
        for(const item of items){
            this._items.push(item)
        }
        this._returnLocationOverride = returnLocationOverride
    }

    startReturn(loan: ILoan): ILoan{
        // ping out the item to accept this return!
        return loan
    }
    finishReturn(loan: ILoan): ILoan {
        // todo - see the user actions to determine the status
        return loan
    }

    get items(): Iterable<IThing> {
        return this._items
    }

    addItem(item: IThing): IThing {
        this._items.push(item)
        return item
    }

    preferredReturnLocation(item: IThing): Location{
        if (this._returnLocationOverride){ return this._returnLocationOverride}
        return item.storageLocation
    }
}
