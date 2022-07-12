import {IWaitingList} from "./IWaitingList";
import {IBorrower} from "../people/IBorrower";
import {IThing} from "../things/IThing";

export class FirstComeFirstServeWaitingList implements IWaitingList{
    private readonly members: IBorrower[]
    readonly item: IThing;

    constructor(item: IThing){
        this.item = item
        this.members = []
    }

    add(borrower: IBorrower): IWaitingList {
        this.members.push(borrower)
        return this
    }

    isOnList(borrower: IBorrower): boolean {
        const memberIds = this.members.map(b => b.id);
        return borrower.id in memberIds
    }

    pop(): IBorrower | null {
        const first = this.members[0]
        this.members.splice(0, 1)
        return first
    }
}