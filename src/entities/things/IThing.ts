import {ILender} from "../lenders"
import {ThingStatus, ThingTitle, BorrowerVerificationFlags, IMoney, PhysicalLocation, ILocation} from "../../valueItems"
import {IEntity} from "../IEntity";


export interface IThing extends IEntity {
    title: ThingTitle;
    storageLocation: ILocation;
    imageUrls: string[];
    owner: ILender;
    purchaseCost: IMoney | null;
    requiredBorrowerFlags: BorrowerVerificationFlags[];
    status: ThingStatus;
}