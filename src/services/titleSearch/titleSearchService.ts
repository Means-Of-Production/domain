import {ITitleSearchService} from "./ITitleSearchService"
import {Person} from "../../entities"
import {ILibraryRepository} from "../../repositories"
import {ThingTitle, TitleSearchRequest} from "../../valueItems/"

export class TitleSearchService implements ITitleSearchService {
    private readonly libraryRepository: ILibraryRepository

    constructor(libraryRepository: ILibraryRepository) {
        this.libraryRepository = libraryRepository
    }

    private matches(searchRequest: TitleSearchRequest, title: ThingTitle): boolean {
        if(!searchRequest.searchText){
            return true;
        }
        return title.name.includes(searchRequest.searchText) ||
            title.isbn == searchRequest.searchText ||
            title.upc == searchRequest.searchText;
    }

    * find(person: Person, searchRequest: TitleSearchRequest): Iterable<ThingTitle> {
        const libraries = this.libraryRepository.getLibrariesPersonCanUse(person);

        const exported = []
        for(const library of libraries) {
            for(const title of library.availableTitles){
                const id = title.hash
                if(exported.indexOf(id) < 0){
                    if(this.matches(searchRequest, title)) {
                        exported.push(id)
                        yield title
                    }
                }
            }
        }
    }
}
