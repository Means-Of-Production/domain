import {ILoan, IThing, IBorrower} from "../../entities"
import {IBiddingStrategy} from "./IBiddingStrategy"
import {AuctionBid, IMoney, DueDate} from "../../valueItems"
import {ILibrary} from "../../entities"
import {ILoanRepository} from "../../repositories"

/**
 * Form of bidding where the amount a bid is worth decreases the longer it has been held by the same person
 */
export class QuadraticBiddingStrategy implements IBiddingStrategy {
    private readonly loanRepository: ILoanRepository

    constructor(loanRepository: ILoanRepository) {
        this.loanRepository = loanRepository
    }

    private static compareLoans(a: ILoan, b: ILoan): number {
        return DueDate.compare(a.dueDate, b.dueDate)
    }

    async getBidForCost(item: IThing, bidder: IBorrower, amountToPay: IMoney, library: ILibrary, beneficiary?: IBorrower): Promise<AuctionBid> {
        if(!beneficiary){
            beneficiary = bidder
        }

        // get loans for the item
        const itemLoans = Array.from(await this.loanRepository.getLoansForLibrary(library))
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