import {ILoan} from "../loans"
import {Person} from "../people"
import {ILender} from "./ILender"
import {IThing} from "../things"
import {
    EmailAddress,
    PhysicalLocation,
    ThingStatus,
    ReturnNotStartedError,
    LoanStatus,
    ILocation
} from "../../valueItems"

/*
Class to represent the lenders in a distributed library
 */
export class IndividualDistributedLender implements ILender{
    private readonly _items: IThing[]
    readonly person: Person
    readonly id: string
    private readonly _returnLocationOverride: PhysicalLocation | undefined

    constructor(id: string, person: Person, emails: EmailAddress[] = [], items: Iterable<IThing>, returnLocationOverride?: PhysicalLocation){
        this.id = id
        this.person = person
        this._items = []
        for(const item of items){
            this._items.push(item)
        }
        this._returnLocationOverride = returnLocationOverride
    }

    async startReturn(loan: ILoan): Promise<ILoan>{
        // ping out the item to accept this return!
        if(loan.item.status !== ThingStatus.BORROWED){
            throw new ReturnNotStartedError()
        }
        loan.dateReturned = new Date()
        loan.status = LoanStatus.RETURN_STARTED
        return loan
    }

    async finishReturn(loan: ILoan): Promise<ILoan> {
        // we need to check if the loan has been accepted by the lender
        if(loan.status != LoanStatus.WAITING_ON_LENDER_ACCEPTANCE && loan.status != LoanStatus.RETURN_STARTED
        ){
            throw new Error(`Item ${loan.item.title.name} has not been given to the lender yet!`)
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

    preferredReturnLocation(item: IThing): ILocation{
        if (this._returnLocationOverride){ return this._returnLocationOverride}

        return item.storageLocation
    }
}
