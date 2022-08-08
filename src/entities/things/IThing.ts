import {ILender} from "../lenders/ILender"
import {IMoney} from "../../valueItems/money/IMoney"
import {BorrowerVerificationFlags} from "../../valueItems/borrowerVerificationFlags"
import {ThingStatus} from "../../valueItems/thingStatus"
import {ThingTitle} from "../../valueItems/thingTitle";
import {PhysicalLocation} from "../../valueItems/physicalLocation"


export interface IThing {
    id: string;
    title: ThingTitle;
    storageLocation: PhysicalLocation;
    imageUrls: string[];
    owner: ILender;
    purchaseCost: IMoney | null;
    requiredBorrowerFlags: BorrowerVerificationFlags[];
    status: ThingStatus;
}