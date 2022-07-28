import {IWaitingListFactory} from "./IWaitingListFactory";
import {Thing} from "../entities/things/thing";
import {IWaitingList} from "../entities/waitingLists/IWaitingList";
import {FirstComeFirstServeWaitingList} from "../entities/waitingLists/firstComeFirstServeWaitingList";
import {AuctionableWaitingList} from "../entities/waitingLists/auctionableWaitingList";
import {TimeInterval} from "../valueItems/timeInterval";
import {MoneyFactory} from "./moneyFactory";

export class WaitingListFactory implements IWaitingListFactory{
    readonly supportsAuctions: boolean;
    readonly defaultAuctionTime?: TimeInterval
    private readonly moneyFactory?: MoneyFactory;

    constructor(supportsAuctions: boolean = false, defaultAuctionTime?: TimeInterval, moneyFactory?: MoneyFactory) {
        this.supportsAuctions = supportsAuctions
        this.defaultAuctionTime = defaultAuctionTime
        this.moneyFactory = moneyFactory
        if(this.supportsAuctions && (!this.defaultAuctionTime || !this.moneyFactory)){
            throw new Error("Dependencies for auctionable waiting list were not provided!")
        }
    }
    createList(item: Thing): IWaitingList {
        if (this.supportsAuctions){
            if(!this.defaultAuctionTime || !this.moneyFactory){
                throw new Error("Dependencies for auctionable waiting list were not provided!")
            }
            return new AuctionableWaitingList(item, this.defaultAuctionTime.fromNow(), this.moneyFactory, new Date())
        } else {
            return new FirstComeFirstServeWaitingList(item)
        }
    }
}