import {Loan} from "./loan"
import {PersonName} from "../../valueItems/personName"
import {Person} from "../people/person";
import {USDMoney} from "../../valueItems/money/USDMoney";
import {MoneyFactory} from "../../factories/moneyFactory";
import {SimpleTimeBasedFeeSchedule} from "../../factories/feeSchedules/simpleTimeBasedFeeSchedule";
import {Thing} from "../things/thing";
import {ThingStatus} from "../../valueItems/thingStatus";
import {IndividualDistributedLender} from "../lenders/individualDistributedLender";
import {ThingTitle} from "../../valueItems/thingTitle";
import {SimpleLibrary} from "../libraries/simpleLibrary";
import {WaitingListFactory} from "../../factories/waitingListFactory";
import {Borrower} from "../people/borrower";
import {DueDate} from "../../valueItems/dueDate";
import {PhysicalLocation} from "../../valueItems/location";
import {LoanStatus} from "../../valueItems/loanStatus";
import {TimeInterval} from "../../valueItems/timeInterval";

const testPerson = new Person("bob", new PersonName("Doug", "Jones"))
const feeSchedule = new SimpleTimeBasedFeeSchedule(new USDMoney(0), new MoneyFactory())
const testLib = new SimpleLibrary("testLib1", "testLibrary", testPerson, new PhysicalLocation(0, 0), new WaitingListFactory(), new USDMoney(0), [], new MoneyFactory(), feeSchedule, TimeInterval.fromDays(14));
const testBorrower = new Borrower("testBorrower", testPerson, testLib)

const testTitle = new ThingTitle("test")
const testLender = new IndividualDistributedLender("lender", new Person("test", new PersonName("Testy", "McTesterson")))

describe("Loan", () => {
    it("can move from Borrowed to return started", () => {
        const thing = new Thing("test", testTitle, new PhysicalLocation(0, 0), testLender, ThingStatus.BORROWED, [], null, [])
        const underTest = new Loan("test", thing, testBorrower, new DueDate())

        expect(underTest.status).toEqual(LoanStatus.BORROWED)

        // act
        underTest.status = LoanStatus.RETURN_STARTED

        expect(underTest.status).toEqual(LoanStatus.RETURN_STARTED)
    })
})