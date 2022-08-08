import {IndividualDistributedLender} from "./individualDistributedLender";
import {Person} from "../people/person";
import {PersonName} from "../../valueItems/personName";
import {ILoan} from "../loans/ILoan";
import {instance, mock, when} from "ts-mockito";
import {IThing} from "../things/IThing";
import {ThingStatus} from "../../valueItems/thingStatus";

const person = new Person("person", new PersonName("Bob", "Jones"))

describe("Individual Distributed Lender", () => {
    it("throws if attempting to return non-borrowed item", () => {
        const underTest = new IndividualDistributedLender("test", person, [], [])

        const item = mock<IThing>();
        when(item.status).thenReturn(ThingStatus.READY)
        const loan: ILoan = mock<ILoan>()
        when(loan.item).thenReturn(instance(item))

        expect(() => underTest.startReturn(instance(loan))).toThrow()
    })

    it("sets date on starting return", () => {
        const underTest = new IndividualDistributedLender("test", person, [], [])

        const item = mock<IThing>();
        when(item.status).thenReturn(ThingStatus.BORROWED)

        const loan: ILoan = mock<ILoan>()
        when(loan.item).thenReturn(instance(item))

        const res = underTest.startReturn(instance(loan))

        expect(res.dateReturned).not.toBeNull()
    })
})