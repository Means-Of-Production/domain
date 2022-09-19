import {IBiddingStrategy} from "./IBiddingStrategy";
import {IThing, IBorrower, ILibrary} from "../../entities";
import {IMoney, AuctionBid} from "../../valueItems";

/**
 * Simple form of bidding - the bid is the amount you put in for yourself or another
 */
export class RegularBiddingStrategy implements IBiddingStrategy {
    getBidForCost(thing: IThing, bidder: IBorrower, amountToPay: IMoney, library: ILibrary, beneficiary?: IBorrower): AuctionBid {
        if(!beneficiary){
            beneficiary = bidder
        }
        return new AuctionBid(amountToPay, amountToPay, bidder, beneficiary);
    }

}