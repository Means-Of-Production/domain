import {Thing} from "./thing"
import {ThingTitle, PhysicalLocation, ThingStatus, PersonName} from "../../valueItems"
import {IndividualDistributedLender} from "../lenders"
import {Person} from "../people"


describe("Thing", ()=>{
    it("stores values in constructor", () => {
        const location = new PhysicalLocation(0, 0)
        const title = new ThingTitle("thingName", "isbn", "upc")
        const lender = new IndividualDistributedLender(
            "lender",
            new Person("person", new PersonName("Testy", "McTesterson"))
        )

        const res = new Thing(
           "id",
           title,
           location,
            lender,
            ThingStatus.BORROWED,
            ["https://example.com/img1.jpg"],
            null
        )

        expect(res).not.toBeNull()
    });
});
