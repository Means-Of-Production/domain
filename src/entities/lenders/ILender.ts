import {ILoan} from "../loans/ILoan";
import {IThing} from "../things/IThing"
import {PhysicalLocation} from "../../valueItems/physicalLocation";
import {IEntity} from "../IEntity";

export interface ILender extends IEntity{
    readonly items: Iterable<IThing>
    preferredReturnLocation(item: IThing): PhysicalLocation
    startReturn(loan: ILoan): ILoan
    finishReturn(loan: ILoan): ILoan
}