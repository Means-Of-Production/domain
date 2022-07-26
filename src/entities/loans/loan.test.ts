import {Loan} from "./loan"
import {Thing} from "../things/thing"
import {PersonName} from "../../valueItems/personName"
import {Person} from "../people/person";
import {LoanStatus} from "../../valueItems/loanStatus"
import {ThingStatus} from "../../valueItems/thingStatus"
import {Borrower} from "../people/borrower";
import {Location} from "../../valueItems/location"
import {SimpleLibrary} from "../libraries/simpleLibrary";
import {ThingTitle} from "../../valueItems/thingTitle";
import {IndividualDistributedLender} from "../lenders/individualDistributedLender";
import {WaitingListFactory} from "../../factories/waitingListFactory";
import {USDMoney} from "../../valueItems/money/USDMoney";
import {DueDate} from "../../valueItems/dueDate";
import {MoneyFactory} from "../../factories/moneyFactory";
import {SimpleTimeBasedFeeSchedule} from "../../factories/simpleTimeBasedFeeSchedule";

const loc = new Location(40.6501, -73.94958)

const testPerson = new Person("bob", new PersonName("Doug", "Jones"))
const feeSchedule = new SimpleTimeBasedFeeSchedule(new USDMoney(0), new MoneyFactory())
const testLib = new SimpleLibrary("testLibrary", testPerson, new Location(0, 0), new WaitingListFactory(), new USDMoney(0), [], new MoneyFactory(), feeSchedule);

const testTitle = new ThingTitle("test")
const testLender = new IndividualDistributedLender("lender", new Person("test", new PersonName("Testy", "McTesterson")),[], [])

describe("Loan", () => {
    it('should change status on starting return', () => {
        const borrower = new Borrower("1", testPerson, testLib)
        const thing = new Thing("test", testTitle, loc, testLender, ThingStatus.BORROWED, "", [], null, [])

        const loan = new Loan(
            "testId",
            thing,
            borrower,
            new DueDate(new Date(2020,12,23))
        )

        expect(loan.active).toEqual(true)

        // act
        loan.startReturn()

        expect(loan.status).toEqual(LoanStatus.RETURN_STARTED)
        expect(loan.active).toEqual(false)
    })

    it('should change status on finishing return', () => {
        const borrower = new Borrower("1", testPerson, testLib)
        const thing = new Thing("test", testTitle, loc, testLender, ThingStatus.BORROWED, "", [], null, [])

        const loan = new Loan(
            "testId",
            thing,
            borrower,
            new DueDate(new Date(2020,12,23)),
            LoanStatus.RETURN_STARTED
        )

        expect(loan.active).toEqual(false)

        // act
        loan.finishReturn()

        expect(loan.status).toEqual(LoanStatus.RETURNED)
        expect(loan.active).toEqual(false)
    })
})