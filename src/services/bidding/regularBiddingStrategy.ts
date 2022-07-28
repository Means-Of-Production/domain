import {IBiddingStrategy} from "./IBiddingStrategy";
import {IThing} from "../../entities/things/IThing";
import {IBorrower} from "../../entities/people/IBorrower";
import {IMoney} from "../../valueItems/money/IMoney";
import {AuctionBid} from "../../entities/waitingLists/auctionBid";

/**
 * Simple form of bidding - the bid is the amount you put in for yourself or another
 */
export class RegularBiddingStrategy implements IBiddingStrategy {
    getBidForCost(item: IThing, bidder: IBorrower, amountToPay: IMoney, beneficiary?: IBorrower): AuctionBid {
        if(!beneficiary){
            beneficiary = bidder
        }
        return new AuctionBid(amountToPay, amountToPay, bidder, beneficiary);
    }

}