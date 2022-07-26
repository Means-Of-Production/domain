import {ILoan} from "../loans/ILoan";
import {Person} from "../people/person";
import {ILender} from "./ILender";
import {IThing} from "../things/IThing";
import {EmailAddress} from "../../valueItems/emailAddress";
import {Location} from "../../valueItems/location";
import {ThingStatus} from "../../valueItems/thingStatus";
import {ReturnNotStarted} from "../../valueItems/exceptions";
import {LoanStatus} from "../../valueItems/loanStatus";

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
        if(loan.item.status !== ThingStatus.BORROWED){
            throw new ReturnNotStarted()
        }
        return loan
    }

    finishReturn(loan: ILoan): ILoan {
        // we need to check if the loan has been accepted by the lender
        if(loan.status != LoanStatus.WAITING_ON_LENDER_ACCEPTANCE && loan.status != LoanStatus.RETURN_STARTED
        ){
            throw new Error(`Item ${loan.item.title.name} has not be given to the lender yet!`)
        }
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
