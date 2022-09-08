import {ILoan} from "../../entities";
import {IMoney} from "../../valueItems";

export interface IFeeSchedule{
    feesForOverdueItem(loan: ILoan): IMoney
    feesForDamagedItem(loan: ILoan): IMoney
}