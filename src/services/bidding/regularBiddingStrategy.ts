import {IBiddingStrategy} from "./IBiddingStrategy";
import {IThing} from "../../entities/things/IThing";
import {IBorrower} from "../../entities/people/IBorrower";
import {IMoney} from "../../valueItems/money/IMoney";
import {AuctionBid} from "../../valueItems/auctionBid";
import {ILibrary} from "../../entities"

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