import {IMoney} from "../valueItems/money/IMoney";
import {USDMoney} from "../valueItems/money/USDMoney";

export class MoneyFactory{
    private readonly moneyType: string

    constructor(type: string = "USDMoney") {
        this.moneyType = type
    }

    public getEmptyMoney() : IMoney {
        switch (this.moneyType){
            case "USDMoney":
                return new USDMoney(0)
        }
        throw new Error(`Invalid money type of ${this.moneyType}`)
    }
}