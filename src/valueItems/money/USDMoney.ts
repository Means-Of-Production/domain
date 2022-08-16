import {IMoney} from "./IMoney";
import {DifferentTypesOfMoneyError} from "../exceptions";


export class USDMoney implements IMoney{
    readonly amount: number;
    readonly currencyName: string;

    constructor(amount: number) {
        this.amount = amount;
        this.currencyName = "USD";
    }

    equals(other: IMoney): boolean {
        if(!(other instanceof USDMoney)){
            throw new DifferentTypesOfMoneyError()
        }
        return this.amount === other.amount
    }

    greaterThan(other: IMoney): boolean {
        if(!(other instanceof USDMoney)){
            throw new DifferentTypesOfMoneyError()
        }
        return this.amount > other.amount
    }

    lessThan(other: IMoney): boolean {
        if(!(other instanceof USDMoney)){
            throw new DifferentTypesOfMoneyError()
        }
        return this.amount < other.amount
    }

    add(other: IMoney): IMoney {
        if(!(other instanceof USDMoney)){
            throw new DifferentTypesOfMoneyError();
        }
        return new USDMoney(this.amount + other.amount)
    }

    any(): boolean {
        return this.amount > 0
    }

    multiply(amount: number): IMoney {
        return new USDMoney(this.amount * amount)
    }

    get symbol(): string{
        return "$"
    }

}