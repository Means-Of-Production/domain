import {IBorrower} from "../entities/people/IBorrower";
import {Person} from "../entities/people/person";

export interface IBorrowerRepository {
    getBorrowersForPerson(person: Person): Promise<Iterable<IBorrower>>
}