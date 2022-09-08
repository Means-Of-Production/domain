import {ILoan} from "../loans";
import {IThing} from "../things"
import {ILocation} from "../../valueItems"
import {IEntity} from "../IEntity";

export interface ILender extends IEntity{
    readonly items: Iterable<IThing>
    preferredReturnLocation(item: IThing): ILocation
    startReturn(loan: ILoan): ILoan
    finishReturn(loan: ILoan): ILoan
}