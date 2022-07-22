import {Person} from "../people/person";
import {PersonName} from "../../valueItems/personName";
import {SimpleLibrary} from "./simpleLibrary";
import {WaitingListFactory} from "../../factories/waitingListFactory";
import {USDMoney} from "../../valueItems/money/USDMoney";
import {Thing} from "../things/thing";
import {ThingTitle} from "../../valueItems/thingTitle";
import {Location} from "../../valueItems/location";
import {ThingStatus} from "../../valueItems/thingStatus";
import {Borrower} from "../people/borrower";
import {DueDate} from "../../valueItems/dueDate";
import {MoneyFactory} from "../../factories/moneyFactory";
import {SimpleTimeBasedFeeSchedule} from "../../factories/simpleTimeBasedFeeSchedule";
import {BorrowerNotInGoodStanding, InvalidThingStatusToBorrow} from "../../valueItems/exceptions";
import {LibraryFee} from "./libraryFee";
import {Loan} from "../loans/loan";
import {FeeStatus} from "../../valueItems/feeStatus";
import {LoanStatus} from "../../valueItems/loanStatus";

function createLibrary(): SimpleLibrary {
    const person = new Person("1", new PersonName("Test", "McTesterson"))
    const location = new Location(0, 0)
    const moneyFactory = new MoneyFactory()
    return new SimpleLibrary(
        "testLibrary",
        person,
        location,
        new WaitingListFactory(),
        new USDMoney(100),
        [],
        moneyFactory,
        new SimpleTimeBasedFeeSchedule(moneyFactory.getEmptyMoney(), moneyFactory)
    )
}

function createThing(library: SimpleLibrary) {
    return new Thing("item", new ThingTitle("title"), library.location, library, ThingStatus.READY, "", [], null);
}

function getDueDate(numDays: number = 1) : DueDate {
    const now = new Date()
    const then = new Date(now.setDate(now.getDate() + numDays))
    return new DueDate(then)
}


describe("Simple Library Tests", () => {
    it("lists items it has", () => {
        const library = createLibrary();

        const item = createThing(library)
        library.addItem(item)

        const res = library.availableTitles

        const resArray = Array.from(res)

        expect(resArray.length).toEqual(1)
        expect(resArray[0].name).toEqual("title")
    })

    it("item marked damaged is no longer available", () => {
        const library = createLibrary()

        const item = new Thing("item", new ThingTitle("title"), library.location, library, ThingStatus.DAMAGED, "", [], null);
        library.addItem(item)

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

        const item = createThing(library)
        library.addItem(item)

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

        const item = createThing(library)
        const item2 = new Thing("item2", new ThingTitle("title"), library.location, library, ThingStatus.READY, "", [], null);
        library.addItem(item)
        library.addItem(item2)

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
        const item = new Thing("item", new ThingTitle("title"), library.location, library, ThingStatus.DAMAGED, "", [], cost)

        library.addItem(item)

        // act
        expect(() => library.borrow(item, borrower, new DueDate(new Date(2022, 12, 12, 0,0,0, 0)))).toThrow(InvalidThingStatusToBorrow)
    })

    it("cannot borrow if you have too many fees", () => {
        const library = createLibrary()

        const borrower = new Borrower("libraryMember", library.administrator, library, [])
        library.addBorrower(borrower)

        const item = createThing(library)
        library.addItem(item)

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

        const item = createThing(library)
        library.addItem(item)

        const loan = library.borrow(item, borrower, getDueDate())

        expect(loan).not.toBeNull()
        expect(loan.item.status).toEqual(ThingStatus.CURRENTLY_BORROWED)

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

        const item = new Thing("item", new ThingTitle("title"), library.location, library, ThingStatus.READY, "", [], new USDMoney(25))
        library.addItem(item)

        const loan = library.borrow(item, borrower, getDueDate())

        expect(loan).not.toBeNull()
        expect(loan.item.status).toEqual(ThingStatus.CURRENTLY_BORROWED)

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

    it("item returned late has loan overdue and ")
})