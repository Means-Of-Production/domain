import {ITitleSearchService} from "./ITitleSearchService"
import {Person} from "../../entities"
import {ILibraryRepository} from "../../repositories"
import {TitleSearchRequest, ThingTitle} from "../../valueItems/"

export class TitleSearchService implements ITitleSearchService {
    private readonly libraryRepository: ILibraryRepository

    constructor(libraryRepository: ILibraryRepository) {
        this.libraryRepository = libraryRepository
    }

    * find(person: Person, searchRequest: TitleSearchRequest): Iterable<ThingTitle> {
        const libraries = this.libraryRepository.getLibrariesPersonCanUse(person);

        const exported = []
        for (const library of libraries) {
            for (const item of library.availableTitles) {
                const id = item.hash
                if (exported.indexOf(id) < 0) {
                    if (searchRequest.matches(item)) {
                        exported.push(id)
                        yield item
                    }
                }
            }
        }
    }
}
