import {IBorrower} from "../people/IBorrower";
import {IThing} from "../things/IThing";
import {ReservationStatus} from "../../valueItems/reservationStatus";
import {InvalidReservationStateTransitionError} from "../../valueItems/exceptions";

export class Reservation{
    public readonly id: string | undefined
    public readonly holder: IBorrower
    public readonly item: IThing
    public readonly goodUntil: Date
    private _status: ReservationStatus

    constructor(id: string | undefined, holder: IBorrower, item: IThing, goodUntil: Date, status: ReservationStatus) {
        this.id = id
        this.holder = holder
        this.item = item
        this.goodUntil = goodUntil
        this._status = status
    }

    public get status(): ReservationStatus{
        return this._status
    }

    public set status(status: ReservationStatus){
        let validNextStatus: ReservationStatus[]
        switch(this.status){
            case ReservationStatus.ASSIGNED:
                validNextStatus = [ReservationStatus.BORROWER_NOTIFIED]
                break
            case ReservationStatus.BORROWER_NOTIFIED:
                validNextStatus = [ReservationStatus.EXPIRED, ReservationStatus.BORROWED]
                break
            case ReservationStatus.BORROWED:
                validNextStatus = []
                break
            case ReservationStatus.EXPIRED:
                validNextStatus = []
                break
            case ReservationStatus.CANCELLED:
                validNextStatus = []
                break
        }
        if(validNextStatus.indexOf(status) < 0){
            throw new InvalidReservationStateTransitionError(this.status, status)
        }
        this._status = status
    }
}