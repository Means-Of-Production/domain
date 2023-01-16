import {Person} from "../../entities"
import {TitleSearchRequest, TitleSearchResult} from "../../valueItems"

export interface ITitleSearchService {
    find(person: Person, searchRequest: TitleSearchRequest): Promise<Iterable<TitleSearchResult>>
}