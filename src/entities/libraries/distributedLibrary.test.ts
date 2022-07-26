import {PersonName} from "../../valueItems/personName";
import {Thing} from "../things/thing";
import {ThingStatus} from "../../valueItems/thingStatus";
import {BorrowerNotInGoodStanding, InvalidThingStatusToBorrow} from "../../valueItems/exceptions";
import {Borrower} from "../people/borrower";
import {Loan} from "../loans/loan";
import {Location} from "../../valueItems/location";
import {DistributedLibrary} from "./distributedLibrary";
import {IndividualDistributedLender} from "../lenders/individualDistributedLender";
import {Person} from "../people/person";
import {ThingTitle} from "../../valueItems/thingTitle";
import {USDMoney} from "../../valueItems/money/USDMoney";
import {WaitingListFactory} from "../../factories/waitingListFactory";
import {DueDate} from "../../valueItems/dueDate";
import {LibraryFee} from "./libraryFee";
import {FeeStatus} from "../../valueItems/feeStatus";
import {LoanStatus} from "../../valueItems/loanStatus";
import {MoneyFactory} from "../../factories/moneyFactory";
import {SimpleTimeBasedFeeSchedule} from "../../factories/simpleTimeBasedFeeSchedule";
import {IMoney} from "../../valueItems/money/IMoney";
import {ILender} from "../lenders/ILender";

const loc =  new Location(40.6501, -73.94958)

const testPerson = new Person("1", new PersonName("Testy", "McTesterson"))
const testLender = new IndividualDistributedLender("testLender", testPerson, [], [])

function createLibrary(): DistributedLibrary {
    const person = new Person("1", new PersonName("Test", "McTesterson"))
    const moneyFactory = new MoneyFactory()
    const lib = new DistributedLibrary(
        "testDistributedLibrary",
        person,
        new USDMoney(100),
        new WaitingListFactory(),
        [],
        new SimpleTimeBasedFeeSchedule(moneyFactory.getEmptyMoney(), moneyFactory),
        moneyFactory
    )
    lib.addLender(testLender)

    return lib
}

function createThing(lender: ILender, purchaseCost: IMoney | null = null) {
    const thing = new Thing("item", new ThingTitle("title"), loc, lender, ThingStatus.READY, "", [], purchaseCost);
    testLender.addItem(thing)
    return thing
}

function getDueDate(numDays: number = 1) : DueDate {
    const now = new Date()
    const then = new Date(now.setDate(now.getDate() + numDays))
    return new DueDate(then)
}

describe("DistributedLibrary", () => {
    it("lists items it has", () => {
        const library = createLibrary();

        const item = createThing(testLender)

        const res = library.availableTitles

        const resArray = Array.from(res)

        expect(resArray.length).toEqual(1)
        expect(resArray[0].name).toEqual(item.title.name)
    })

    it("item marked damaged is no longer available", () => {
        const library = createLibrary()

        const item = new Thing("item", new ThingTitle("title"), loc, testLender, ThingStatus.DAMAGED, "", [], null);
        testLender.addItem(item)

        // act
        const availableTitles = Array.from(library.availableTitles)

        // assert
        expect(availableTitles.length).toEqual(0)

        const allTitles = Array.from(library.allTitles)
        expect(allTitles.length).toEqual(1)
        expect(allTitles[0].name).toEqual("title")
    })

    it("borrowed item is no longer available", () => {
        const library = createLibrary()
        const borrower = new Borrower("libraryMember", library.administrator, library, [])
        library.addBorrower(borrower)

        const item = createThing(testLender)

        // act
        const loan = library.borrow(item, borrower, new DueDate())

        expect(loan).not.toBeNull()
        const availableTitles = Array.from(library.availableTitles)
        expect(availableTitles.length).toEqual(0)

        const allTitles = Array.from(library.allTitles)
        expect(allTitles.length).toEqual(1)
        expect(allTitles[0].name).toEqual("title")
    })

    it("item borrowed with another title available is still available", () => {
        const library = createLibrary()
        const borrower = new Borrower("libraryMember", library.administrator, library, [])
        library.addBorrower(borrower)

        const item = createThing(testLender)
        const item2 = new Thing("item2", new ThingTitle("title"), loc, testLender, ThingStatus.READY, "", [], null);
        testLender.addItem(item2)

        // act
        const loan = library.borrow(item, borrower, new DueDate())

        expect(loan).not.toBeNull()
        const availableTitles = Array.from(library.availableTitles)
        expect(availableTitles.length).toEqual(1)

        const allTitles = Array.from(library.allTitles)
        expect(allTitles.length).toEqual(1)
        expect(allTitles[0].name).toEqual("title")
    })

    it("cannot borrow a damaged item", () => {
        const library = createLibrary()

        const borrower = new Borrower("libraryMember", library.administrator, library, [])
        library.addBorrower(borrower)

        const cost = new USDMoney(100)
        const item = new Thing("item", new ThingTitle("title"), loc, testLender, ThingStatus.DAMAGED, "", [], cost)
        testLender.addItem(item)

        // act
        expect(() => library.borrow(item, borrower, new DueDate(new Date(2022, 12, 12, 0,0,0, 0)))).toThrow(InvalidThingStatusToBorrow)
    })

    it("cannot borrow if you have too many fees", () => {
        const library = createLibrary()

        const borrower = new Borrower("libraryMember", library.administrator, library, [])
        library.addBorrower(borrower)

        const item = createThing(testLender)

        const loan = new Loan("loan", item, borrower, new DueDate())
        const fee = new LibraryFee(new USDMoney(120), loan, FeeStatus.OUTSTANDING);
        borrower.applyFee(fee)


        // act
        expect(() => library.borrow(item, borrower, new DueDate(new Date(2022, 12, 12, 0,0,0, 0)))).toThrow(BorrowerNotInGoodStanding)
    })

    it("can borrow and return on time", () => {
        const library = createLibrary()

        const borrower = new Borrower("libraryMember", library.administrator, library, [])
        library.addBorrower(borrower)

        const item = createThing(testLender)

        const loan = library.borrow(item, borrower, getDueDate())

        expect(loan).not.toBeNull()
        expect(loan.item.status).toEqual(ThingStatus.BORROWED)

        const updatedLoan = library.startReturn(loan)
        expect(updatedLoan).not.toBeNull()
        expect(updatedLoan.status).toEqual(LoanStatus.RETURN_STARTED)

        const finished = library.finishReturn(updatedLoan)
        expect(finished).not.toBeNull()
        expect(finished.status).toEqual(LoanStatus.RETURNED)
        expect(finished.item.status).toEqual(ThingStatus.READY)
    })

    it("item borrowed but marked damaged gets RETURNED_DAMAGED", () => {
        const library = createLibrary()

        const borrower = new Borrower("libraryMember", library.administrator, library, [])
        library.addBorrower(borrower)

        const item = createThing(testLender, new USDMoney(25))

        const loan = library.borrow(item, borrower, getDueDate())

        expect(loan).not.toBeNull()
        expect(loan.item.status).toEqual(ThingStatus.BORROWED)

        const updatedLoan = library.startReturn(loan)
        expect(updatedLoan).not.toBeNull()
        expect(updatedLoan.status).toEqual(LoanStatus.RETURN_STARTED)

        // ACT
        updatedLoan.item.status = ThingStatus.DAMAGED

        const finished = library.finishReturn(updatedLoan)

        // assert
        expect(finished).not.toBeNull()
        expect(finished.status).toEqual(LoanStatus.RETURNED_DAMAGED)
        expect(finished.item.status).toEqual(ThingStatus.DAMAGED)

        const fees = Array.from(borrower.fees)
        expect(fees.length).toEqual(1)
        expect(fees[0].amount.amount).toEqual(item.purchaseCost?.amount)
    })

    it("item returned late has loan overdue but item is ready", () => {
        const library = createLibrary()

        const borrower = new Borrower("libraryMember", library.administrator, library, [])
        library.addBorrower(borrower)

        const item = createThing(testLender, new USDMoney(100))

        const loan = library.borrow(item, borrower, getDueDate(-10))

        expect(loan).not.toBeNull()
        expect(loan.item.status).toEqual(ThingStatus.BORROWED)

        const updatedLoan = library.startReturn(loan)
        expect(updatedLoan).not.toBeNull()
        expect(updatedLoan.status).toEqual(LoanStatus.RETURN_STARTED)

        const finished = library.finishReturn(updatedLoan)
        expect(finished).not.toBeNull()
        expect(finished.status).toEqual(LoanStatus.OVERDUE)
        expect(finished.item.status).toEqual(ThingStatus.READY)

        const fees = Array.from(borrower.fees)
        expect(fees.length).toEqual(1)
        expect(fees[0].amount.amount).toBeGreaterThan(0)
        expect(fees[0].amount.amount).toBeLessThan(100)
    });
})