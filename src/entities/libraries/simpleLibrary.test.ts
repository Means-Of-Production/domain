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
})