import {IFeeSchedule} from "./IFeeSchedule"
import {IMoney} from "../../valueItems"
import {ILoan} from "../../entities"
import {MoneyFactory} from "../moneyFactory"

export class NoFeeSchedule implements IFeeSchedule {
    private readonly moneyFactory: MoneyFactory

    constructor(moneyFactory: MoneyFactory){
        this.moneyFactory = moneyFactory
    }

    feesForDamagedItem(loan: ILoan): IMoney {
        return this.moneyFactory.getEmptyMoney()
    }

    feesForOverdueItem(loan: ILoan): IMoney {
        return this.moneyFactory.getEmptyMoney()
    }

}