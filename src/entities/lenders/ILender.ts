import {ILoan} from "../loans";
import {IThing} from "../things"
import {PhysicalLocation} from "../../valueItems"
import {IEntity} from "../IEntity";

export interface ILender extends IEntity{
    readonly items: Iterable<IThing>
    preferredReturnLocation(item: IThing): PhysicalLocation
    startReturn(loan: ILoan): ILoan
    finishReturn(loan: ILoan): ILoan
}