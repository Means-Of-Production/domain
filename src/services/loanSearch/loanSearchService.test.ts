import {anything, instance, mock, when} from "ts-mockito"
import {ILibraryRepository} from "../../repositories"
import {IBorrower, ILibrary, ILoan, Person} from "../../entities"
import {LoanSearchService} from "./loanSearchService"
import {PersonName} from "../../valueItems"

describe("LoanSearchService", () => {
    it("getLoansForPersonFiltersByBorrower", () => {
        const person: Person = new Person("personId", new PersonName("Testy", "McTesterson"))
        const borrower: IBorrower = mock()
        when(borrower.person).thenReturn(person)

        const otherPerson: Person = new Person("anotherPerson", new PersonName("Billy", "Jean"))
        const otherBorrower: IBorrower = mock()
        when(otherBorrower.person).thenReturn(otherPerson)

        const library: ILibrary = mock()
        when(library.getLoans())
        const libraryRepository: ILibraryRepository = mock()

        const loan1: ILoan = mock()
        when(loan1.borrower).thenReturn(instance(borrower))

        const loan2: ILoan = mock()
        when(loan2.borrower).thenReturn(instance(otherBorrower))

        when(library.getLoans()).thenReturn([instance(loan1), instance(loan2)])
        when(libraryRepository.getLibrariesPersonCanUse(anything())).thenReturn([instance(library)])

        const underTest = new LoanSearchService(instance(libraryRepository))

        const res = Array.from(underTest.getLoansForPerson(person))

        expect(res.length).toEqual(1)
    })
})