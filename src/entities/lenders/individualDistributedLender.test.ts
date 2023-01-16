import {IndividualDistributedLender} from "./individualDistributedLender"
import {Person} from "../people"
import {ILoan} from "../loans"
import {instance, mock, when} from "ts-mockito"
import {IThing} from "../things"
import {LoanStatus, PhysicalLocation, ThingStatus, PersonName} from "../../valueItems"

const person = new Person("person", new PersonName("Bob", "Jones"))

describe("Individual Distributed Lender", () => {
    it("throws if attempting to return non-borrowed item", () => {
        const underTest = new IndividualDistributedLender("test", person, [], [])

        const item = mock<IThing>();
        when(item.status).thenReturn(ThingStatus.READY)
        const loan: ILoan = mock<ILoan>()
        when(loan.item).thenReturn(instance(item))

        expect(async () => await underTest.startReturn(instance(loan))).rejects.not.toBeNull()
    })

    it("throws if attempts to finish a return which hasnt notified lender", () => {
        const underTest = new IndividualDistributedLender("test", person, [], [])

        const loan: ILoan = mock<ILoan>()
        when(loan.status).thenReturn(LoanStatus.BORROWED)

        expect(async () => await underTest.finishReturn(instance(loan))).rejects.not.toBeNull()
    })

    it("overrides return location if provided", () => {
        const myHouse = new PhysicalLocation(100, 100, "100 Center Street")

        const itemDefault = new PhysicalLocation(1, 1, "not there")
        const item = mock<IThing>()
        when(item.storageLocation).thenReturn(itemDefault)

        const underTest = new IndividualDistributedLender("test", person, [], [instance(item)], myHouse)

        const res = underTest.preferredReturnLocation(instance(item))
        expect(res).toEqual(myHouse)
        expect(res).not.toEqual(itemDefault)
    })

    it("uses item return location if no default provided", () => {
        const itemDefault = new PhysicalLocation(1, 1, "not there")
        const item = mock<IThing>()
        when(item.storageLocation).thenReturn(itemDefault)

        const underTest = new IndividualDistributedLender("test", person, [], [instance(item)])

        const res = underTest.preferredReturnLocation(instance(item))
        expect(res).toEqual(itemDefault)
    })
})