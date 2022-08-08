import {IMoney} from "./money/IMoney";
import {IBorrower} from "../entities/people/IBorrower";
import {IAuctionBid} from "../entities/waitingLists/IAuctionBid";

export class AuctionBid implements IAuctionBid{
    readonly amountBid: IMoney;
    readonly amountPaid: IMoney;
    readonly madeBy: IBorrower;
    readonly madeFor: IBorrower;

    constructor(amountBid: IMoney, amountPaid: IMoney, madeBy: IBorrower, madeFor: IBorrower) {
        this.amountBid = amountBid
        this.amountPaid= amountPaid
        this.madeBy = madeBy
        this.madeFor = madeFor
    }

}