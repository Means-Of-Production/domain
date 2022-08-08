import { IRepository } from "./IRepository";
import {IBorrower} from "../entities/people/IBorrower";
import {ILoan} from "../entities/loans/ILoan";

export interface ILoanRepository extends IRepository<ILoan>{
    getForBorrower(borrower: IBorrower): Iterable<ILoan>;
}