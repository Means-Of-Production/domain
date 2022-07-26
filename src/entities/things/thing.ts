import {ThingStatus} from "../../valueItems/thingStatus"
import {Location} from "../../valueItems/location";
import {IMoney} from "../../valueItems/money/IMoney"
import {BorrowerVerificationFlags} from "../../valueItems/borrowerVerificationFlags";
import {ILender} from "../lenders/ILender";
import {IThing} from "./IThing"
import {ThingTitle} from "../../valueItems/thingTitle";
import {InvalidThingStateTransition} from "../../valueItems/exceptions";


export class Thing implements IThing {
    readonly id: string
    readonly description: string
    readonly storageLocation: Location
    readonly imageUrls: string[]
    private _status: ThingStatus = ThingStatus.READY
    readonly owner: ILender
    readonly purchaseCost: IMoney | null = null
    readonly requiredBorrowerFlags: BorrowerVerificationFlags[]

    title: ThingTitle;

    constructor(
        id: string,
        title: ThingTitle,
        storageLocation: Location,
        owner: ILender,
        currentStatus: ThingStatus = ThingStatus.READY,
        description: string = "",
        imageUrls: string[] = [],
        purchaseCost: IMoney | null,
        requiredBorrowerFlags: BorrowerVerificationFlags[] = []
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.imageUrls = imageUrls
        this._status = currentStatus
        this.owner = owner
        this.storageLocation = storageLocation
        this.purchaseCost = purchaseCost
        this.requiredBorrowerFlags = requiredBorrowerFlags
    }

    public get status(): ThingStatus {
        return this._status
    }

    public set status(status: ThingStatus) {
        let validNextStatus: ThingStatus[]
        switch(this._status){
            case ThingStatus.READY:
                validNextStatus = [ThingStatus.BORROWED, ThingStatus.RESERVED]
                break
            case ThingStatus.BORROWED:
                validNextStatus = [ThingStatus.RESERVED, ThingStatus.READY, ThingStatus.DAMAGED]
                break
            case ThingStatus.RESERVED:
                validNextStatus = [ThingStatus.BORROWED, ThingStatus.READY]
                break
            case ThingStatus.DAMAGED:
                // TODO this will require our repair path later
                validNextStatus = []
        }
        if(validNextStatus.indexOf(status) < 0){
            throw new InvalidThingStateTransition(this._status, status)
        }
        this._status = status
    }
}