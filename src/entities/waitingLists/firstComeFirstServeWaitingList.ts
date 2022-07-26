import {IWaitingList} from "./IWaitingList";
import {IBorrower} from "../people/IBorrower";
import {IThing} from "../things/IThing";
import {BaseWaitingList} from "./baseWaitingList";
import {TimeInterval} from "../../valueItems/timeInterval";
import {Reservation} from "./reservation";
import {ReservationStatus} from "../../valueItems/reservationStatus";

export class FirstComeFirstServeWaitingList extends BaseWaitingList{
    private members: IBorrower[]
    private readonly reservationDays: number

    constructor(item: IThing, members: IBorrower[] = [], reservationDays: number = 3){
        super(item)
        this.members = members
        this.reservationDays = reservationDays
    }

    add(borrower: IBorrower): IWaitingList {
        this.members.push(borrower)
        return this
    }

    isOnList(borrower: IBorrower): boolean {
        const memberIds = this.members.map(b => b.id);
        return borrower.id in memberIds
    }

    findNextBorrower(): IBorrower | null {
        return this.members[0]
    }

    protected getReservationTime(): TimeInterval {
        return TimeInterval.fromDays(this.reservationDays)
    }

    processReservationExpired(reservation: Reservation): IWaitingList {
        reservation.status = ReservationStatus.EXPIRED
        this._expiredReservations.push(reservation)
        this.clearCurrentReservation()

        return this
    }

    public cancel(borrower: IBorrower): IWaitingList {
        this.members = this.members.filter(b => b.id != borrower.id)

        return this
    }
}