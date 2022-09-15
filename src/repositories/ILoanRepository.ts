import { IRepository } from "./IRepository";
import {Person, ILoan, IBorrower} from "../entities"

export interface ILoanRepository extends IRepository<ILoan>{
    getForBorrower(borrower: IBorrower): Iterable<ILoan>
    getForPerson(person: Person): Iterable<ILoan>
}