import {ILoan} from "../loans/ILoan";
import {IThing} from "../things/IThing"
import {Location} from "../../valueItems/location";

export interface ILender {
    readonly id: string
    readonly items: Iterable<IThing>
    preferredReturnLocation(item: IThing): Location
    startReturn(loan: ILoan): ILoan
    finishReturn(loan: ILoan): ILoan
}