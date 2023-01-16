import {IRepository} from "./IRepository";
import {ILibrary} from "../entities/libraries/ILibrary";
import {Person} from "../entities/people/person";


export interface ILibraryRepository extends IRepository<ILibrary>{
    getLibrariesPersonCanUse(person: Person): Promise<Iterable<ILibrary>>;
}