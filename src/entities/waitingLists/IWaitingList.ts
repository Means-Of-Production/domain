import {IBorrower} from "../people/IBorrower";
import {IThing} from "../things/IThing";
import {Reservation} from "./reservation";


export interface IWaitingList{
    item: IThing;
    readonly currentReservation: Reservation | null

    findNextBorrower() : IBorrower | null
    add(borrower: IBorrower): IWaitingList
    isOnList(borrower: IBorrower): boolean
    cancel(borrower: IBorrower): IWaitingList

    reserveItemForNextBorrower(): Reservation
    processReservationExpired(reservation: Reservation): IWaitingList
}

