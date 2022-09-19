import {IRepository} from "./IRepository"
import {ILibrary, ILoan, Person} from "../entities"

export interface ILoanRepository extends IRepository<ILoan>{
    getLoansForPerson(person: Person): Iterable<ILoan>
    getLoansForLibrary(library: ILibrary): Iterable<ILoan>
}