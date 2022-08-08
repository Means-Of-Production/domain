import {IThing} from "../../entities/things/IThing";
import {IBorrower} from "../../entities/people/IBorrower";
import {IMoney} from "../../valueItems/money/IMoney";
import {AuctionBid} from "../../valueItems/auctionBid";

/**
 * Takes an amount of money, and returns an AuctionBid.  Allows us to control how bidding actually works
 */
export interface IBiddingStrategy {
    getBidForCost(item: IThing, bidder: IBorrower, amountToPay: IMoney, beneficiary?: IBorrower): AuctionBid;
}