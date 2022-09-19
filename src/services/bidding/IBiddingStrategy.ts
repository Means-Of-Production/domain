import {IThing, IBorrower} from "../../entities"
import {IMoney, AuctionBid} from "../../valueItems"
import {ILibrary} from "../../entities"

/**
 * Takes an amount of money, and returns an AuctionBid.  Allows us to control how bidding actually works
 */
export interface IBiddingStrategy {
    getBidForCost(item: IThing, bidder: IBorrower, amountToPay: IMoney, library: ILibrary, beneficiary?: IBorrower): AuctionBid;
}