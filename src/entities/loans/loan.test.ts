import {Loan} from "./loan"
import {PersonName} from "../../valueItems/personName"
import {Person} from "../people/person";
import {USDMoney} from "../../valueItems/money/USDMoney";
import {MoneyFactory} from "../../factories/moneyFactory";
import {SimpleTimeBasedFeeSchedule} from "../../factories/simpleTimeBasedFeeSchedule";


const testPerson = new Person("bob", new PersonName("Doug", "Jones"))
const feeSchedule = new SimpleTimeBasedFeeSchedule(new USDMoney(0), new MoneyFactory())

describe("Loan", () => {

})