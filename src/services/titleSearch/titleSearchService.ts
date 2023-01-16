import {ITitleSearchService} from "./ITitleSearchService"
import {IThing, Person} from "../../entities"
import {ILibraryRepository} from "../../repositories"
import {ThingTitle, TitleSearchRequest, TitleSearchResult, LibrarySearchResult} from "../../valueItems/"

export class TitleSearchService implements ITitleSearchService {
    private readonly libraryRepository: ILibraryRepository

    constructor(libraryRepository: ILibraryRepository) {
        this.libraryRepository = libraryRepository
    }

    private matches(searchRequest: TitleSearchRequest, thing: IThing): boolean {
        // TODO improve this by using a library like FUSE to search the items and titles
        if(!searchRequest.searchText){
            return true;
        }
        const title = thing.title
        return title.name.includes(searchRequest.searchText) ||
            title.isbn == searchRequest.searchText ||
            title.upc == searchRequest.searchText;
    }

    async find(person: Person, searchRequest: TitleSearchRequest): Promise<Iterable<TitleSearchResult>> {
        const libraries = await this.libraryRepository.getLibrariesPersonCanUse(person);

        const resultsByTitleHash = new Map<string, TitleSearchResult>()
        for(const library of libraries) {
            for(const thing of await library.getAvailableThings()){
                if(this.matches(searchRequest, thing)) {
                    let titleResult = resultsByTitleHash.get(thing.title.hash)
                    if (!titleResult) {
                        titleResult = new TitleSearchResult(thing.title)
                        resultsByTitleHash.set(thing.title.hash, titleResult)
                    }
                    const libRequest = titleResult.getForLibrary(library)
                    libRequest.addThing(thing)
                }
            }
        }

        return resultsByTitleHash.values()
    }
}
