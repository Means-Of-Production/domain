import {ILoan} from "../../entities/loans/ILoan";
import {DueDate} from "../../valueItems/dueDate";
import {IThing} from "../../entities/things/IThing";
import {IBorrower} from "../../entities/people/IBorrower";
import {IMoney} from "../../valueItems/money/IMoney";
import {IBiddingStrategy} from "./IBiddingStrategy";
import {AuctionBid} from "../../valueItems/auctionBid";

/**
 * Form of bidding where the amount a bid is worth decreases the longer it has been held by the same person
 */
export class QuadraticBiddingStrategy implements IBiddingStrategy {
    private readonly loans: ILoan[]

    constructor(loans: Iterable<ILoan>) {
        this.loans = []
        for(const loan of loans){
            this.loans.push(loan)
        }
    }

    private static compareLoans(a: ILoan, b: ILoan): number {
        return DueDate.compare(a.dueDate, b.dueDate)
    }

    getBidForCost(item: IThing, bidder: IBorrower, amountToPay: IMoney, beneficiary?: IBorrower): AuctionBid {
        if(!beneficiary){
            beneficiary = bidder
        }

        // get loans for the item
        const itemLoans = this.loans
            .filter(l => l.item.id == item.id)
            .sort(QuadraticBiddingStrategy.compareLoans)

        // find how many times consecutively the beneficiary has held this item
        let numPreviousLoans = 0
        for (const l of itemLoans) {
            if (l.borrower.id == beneficiary.id) {
                numPreviousLoans += 1
            } else {
                break;
            }
        }

        // multiple effective rate times this inverse.  The longer you hold, the less you get
        const amountBid = numPreviousLoans > 0 ? amountToPay.multiply(1 / numPreviousLoans) : amountToPay

        return new AuctionBid(amountBid, amountToPay, bidder, beneficiary)
    }
}