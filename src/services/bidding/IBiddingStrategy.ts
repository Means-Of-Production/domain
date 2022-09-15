import {IThing} from "../../entities/things/IThing";
import {IBorrower} from "../../entities/people/IBorrower";
import {IMoney} from "../../valueItems/money/IMoney";
import {AuctionBid} from "../../valueItems/auctionBid";
import {ILibrary} from "../../entities"

/**
 * Takes an amount of money, and returns an AuctionBid.  Allows us to control how bidding actually works
 */
export interface IBiddingStrategy {
    getBidForCost(item: IThing, bidder: IBorrower, amountToPay: IMoney, library: ILibrary, beneficiary?: IBorrower): AuctionBid;
}