import {IAuctionableWaitingList} from "./IAuctionableWaitingList";
import {IThing} from "../things/IThing";
import {IBorrower} from "../people/IBorrower";
import {IWaitingList} from "./IWaitingList";
import {IMoney} from "../../valueItems/money/IMoney";
import {IAuctionBid} from "./IAuctionBid";
import {WaitingList} from "./waitingList";
import {MoneyFactory} from "../../factories/moneyFactory";

export class AuctionableWaitingList implements IAuctionableWaitingList{
    readonly ends: Date;
    readonly isActive: boolean;
    readonly item: IThing;
    readonly started: Date;
    readonly moneyFactory: MoneyFactory

    private readonly mainList: IWaitingList
    private readonly bidsByForId: Map<string, IAuctionBid[]>

    constructor(item: IThing, ends: Date, moneyFactory: MoneyFactory, started: Date, isActive: boolean = true) {
        this.mainList = new WaitingList(item)
        this.bidsByForId = new Map<string, IAuctionBid[]>()
        this.moneyFactory = moneyFactory

        this.item = item
        this.started = started
        this.ends = ends
        this.isActive = isActive
    }


    add(borrower: IBorrower): IWaitingList {
        this.mainList.add(borrower)
        return this
    }

    addBid(bid: IAuctionBid): void {
        if(!this.bidsByForId.has(bid.madeFor.id)){
            this.bidsByForId.set(bid.madeFor.id, [])
        }
        const bids = this.bidsByForId.get(bid.madeFor.id)
        if(bids) {
            bids.push(bid)
        }
    }

    getBids(): Iterable<IAuctionBid> {
        const res = []
        for(const id in this.bidsByForId){
            const bids = this.bidsByForId.get(id)
            if(bids) {
                for (const bid of bids) {
                    res.push(bid)
                }
            }
        }

        return res
    }

    getWinningBorrower(): IBorrower {
        let topBorrowerId: string;
        let topAmount: IMoney = this.moneyFactory.getEmptyMoney()

        for (const id in this.bidsByForId){
            let amount = this.moneyFactory.getEmptyMoney()
            const bids = this.bidsByForId.get(id)
            if(bids) {
                for (const bid of bids) {
                    amount.add(bid.amountBid)
                }

                if (amount.greaterThan(topAmount)) {
                    topAmount = amount
                    topBorrowerId = id
                }
            }
        }

        return Array.from(this.getBids()).map(bid => bid.madeFor).filter(b => b.id == topBorrowerId)[0]
    }

    isOnList(borrower: IBorrower): boolean {
        return false;
    }

    pop(): IBorrower | null {
        if(this.bidsByForId.size === 0){
            return this.mainList.pop()
        }

        return this.getWinningBorrower()
    }

    getLargestAmount(): IMoney {
        const amount = this.moneyFactory.getEmptyMoney();
        const winner = this.getWinningBorrower();
        const winnerBids = this.bidsByForId.get(winner.id)
        if(winnerBids){
            for(const bid of winnerBids){
                amount.add(bid.amountBid)
            }
        }

        return amount
    }

}