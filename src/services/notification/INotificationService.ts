import {Reservation} from "../../entities/waitingLists/reservation";

export interface INotificationService {
    notifyBorrowerReservedItemAvailable(reservation: Reservation): void
}