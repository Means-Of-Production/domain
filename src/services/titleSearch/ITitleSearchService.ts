import {Person} from "../../entities"
import {ThingTitle, TitleSearchRequest} from "../../valueItems"

export interface ITitleSearchService {
    find(person: Person, searchRequest: TitleSearchRequest): Iterable<ThingTitle>
}