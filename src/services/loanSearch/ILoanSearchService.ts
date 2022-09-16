import {ILoan, Person} from "../../entities"

export interface ILoanSearchService{
    getLoansForPerson(person: Person): Iterable<ILoan>
}