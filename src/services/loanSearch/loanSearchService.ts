import {ILoanSearchService} from "./ILoanSearchService"
import {ILoan, Person} from "../../entities"
import {ILibraryRepository} from "../../repositories"

export class LoanSearchService implements ILoanSearchService {
    private readonly libraryRepository: ILibraryRepository

    constructor(libraryRepository: ILibraryRepository) {
        this.libraryRepository = libraryRepository
    }

    * getLoansForPerson(person: Person): Iterable<ILoan> {
        for (const library of this.libraryRepository.getLibrariesPersonCanUse(person)) {
            for (const loan of library.getLoans()) {
                if (loan.borrower.person.equals(person)) {
                    yield loan
                }
            }
        }
    }
}