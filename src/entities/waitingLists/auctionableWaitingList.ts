import {IAuctionableWaitingList} from "./IAuctionableWaitingList";
import {IThing} from "../things/IThing";
import {IBorrower} from "../people/IBorrower";
import {IWaitingList} from "./IWaitingList";
import {IMoney} from "../../valueItems/money/IMoney";
import {IAuctionBid} from "./IAuctionBid";
import {MoneyFactory} from "../../factories/moneyFactory";
import {FirstComeFirstServeWaitingList} from "./firstComeFirstServeWaitingList";
import {BaseWaitingList} from "./baseWaitingList";
import {Reservation} from "./reservation";
import {IdFactory} from "../../factories/idFactory";
import { TimeInterval } from "../../valueItems/timeInterval";

export class AuctionableWaitingList extends BaseWaitingList implements IAuctionableWaitingList {
    readonly ends: Date;
    readonly isActive: boolean;
    readonly started: Date;
    readonly moneyFactory: MoneyFactory

    private readonly backupList: IWaitingList
    private readonly bidsByForId: Map<string, IAuctionBid[]>

    constructor(item: IThing, currentReservation: Reservation, expiredReservations: Reservation[], idFactory: IdFactory,  ends: Date, moneyFactory: MoneyFactory, started: Date, isActive: boolean = true) {
        super(item, currentReservation, expiredReservations, idFactory)
        this.backupList = new FirstComeFirstServeWaitingList(item)
        this.bidsByForId = new Map<string, IAuctionBid[]>()
        this.moneyFactory = moneyFactory

        this.started = started
        this.ends = ends
        this.isActive = isActive
    }


    add(borrower: IBorrower): IWaitingList {
        this.backupList.add(borrower)
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

    findNextBorrower(): IBorrower | null {
        if(this.bidsByForId.size === 0){
            return this.backupList.findNextBorrower()
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

    processReservationExpired(reservation: Reservation): IWaitingList {
        throw new Error("Method not implemented.");
    }


    protected getReservationTime(): TimeInterval {
        throw new Error("Method not implemented.");
    }

    cancel(borrower: IBorrower): IWaitingList {
        this.backupList.cancel(borrower);

        if(this.bidsByForId.has(borrower.id)){
            this.bidsByForId.delete(borrower.id)
        }

        // delete any bids for OR by this borrower
        for(const bidList of this.bidsByForId.values()){
            for(const bid of bidList){
                if(bid.madeBy.id == borrower.id){
                    const updatedList = bidList.filter(b => b.madeBy.id != borrower.id)
                    this.bidsByForId.set(bid.madeFor.id, updatedList)
                }
            }
        }

        return this
    }
}