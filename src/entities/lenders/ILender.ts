import {ILoan} from "../loans/ILoan";
import {IThing} from "../things/IThing"
import {PhysicalLocation} from "../../valueItems/physicalLocation";

export interface ILender {
    readonly id: string
    readonly items: Iterable<IThing>
    preferredReturnLocation(item: IThing): PhysicalLocation
    startReturn(loan: ILoan): ILoan
    finishReturn(loan: ILoan): ILoan
}