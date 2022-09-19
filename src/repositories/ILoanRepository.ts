import {IRepository} from "./IRepository"
import {ILoan, Person} from "../entities"

export interface ILoanRepository extends IRepository<ILoan>{
    getLoansForPerson(person: Person): Iterable<ILoan>
}