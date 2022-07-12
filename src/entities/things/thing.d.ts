import { ThingStatus } from "../../valueItems/thingStatus";
import { Location } from "../../valueItems/location";
import { IMoney } from "../../valueItems/money/IMoney";
import { BorrowerVerificationFlags } from "../../valueItems/borrowerVerificationFlags";
import { ILender } from "../lenders/ILender";
import { IThing } from "./IThing";
import { ThingTitle } from "../../valueItems/thingTitle";
export declare class Thing implements IThing {
    readonly id: string;
    readonly description: string;
    readonly storageLocation: Location;
    readonly imageUrls: string[];
    private _status;
    readonly owner: ILender;
    readonly purchaseCost: IMoney | null;
    readonly requiredBorrowerFlags: BorrowerVerificationFlags[];
    title: ThingTitle;
    constructor(id: string, title: ThingTitle, storageLocation: Location, owner: ILender, currentStatus: ThingStatus | undefined, description: string | undefined, imageUrls: string[] | undefined, insuredAmount: IMoney | null, requiredBorrowerFlags?: BorrowerVerificationFlags[]);
    get status(): ThingStatus;
    set status(status: ThingStatus);
}
