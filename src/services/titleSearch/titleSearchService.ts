import {ITitleSearchService} from "./ITitleSearchService"
import {IThing, Person} from "../../entities"
import {ILibraryRepository} from "../../repositories"
import {ThingTitle, TitleSearchRequest, TitleSearchResult, LibrarySearchResult} from "../../valueItems/"

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

    * find(person: Person, searchRequest: TitleSearchRequest): Iterable<TitleSearchResult> {
        const libraries = this.libraryRepository.getLibrariesPersonCanUse(person);

        const results = new Map<ThingTitle, TitleSearchResult>()
        for(const library of libraries) {
            for(const thing of library.getAvailableThings()){
                let titleResult = results.get(thing.title)
                if(!titleResult){
                    titleResult = new TitleSearchResult(thing.title)
                    results.set(thing.title, titleResult)
                }

                if(this.matches(searchRequest, thing.title)){
                    const libRequest = titleResult.getForLibrary(library)
                    libRequest.addThing(thing)
                }
            }
        }

        return results
    }
}
