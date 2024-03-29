import {ThingTitle} from "./thingTitle"
import {ILibrary, IThing} from "../entities"
import {EntityNotAssignedIdError} from "./exceptions"

export class LibrarySearchResult {
    public readonly library: ILibrary
    private readonly _things: IThing[]

    public addThing(item: IThing): LibrarySearchResult {
        this._things.push(item)
        return this
    }

    get things(): Iterable<IThing> {
        return this._things;
    }

    get numCopies(): number {
        return this._things.length
    }

    constructor(library: ILibrary) {
        this.library = library
        this._things = []
    }
}

export class TitleSearchResult {
    public readonly title: ThingTitle
    private readonly _libraryResults: Map<string, LibrarySearchResult>

    public get numCopies(): number {
        return Array.from(this._libraryResults.values()).map(lr => lr.numCopies).reduce((acc, n) => {return acc + n}, 0)
    }

    public get libraryResults(): Iterable<LibrarySearchResult>{
        return this._libraryResults.values()
    }

    public getForLibrary(library: ILibrary): LibrarySearchResult{
        if (!library.id) {
            throw new EntityNotAssignedIdError(`Library ${library.name} has not yet been saved!`)
        }

        let result = this._libraryResults.get(library.id)
        if(!result) {
            result = new LibrarySearchResult(library)
            this._libraryResults.set(library.id, result)
        }
        return result
    }

    constructor(title: ThingTitle) {
        this.title = title
        this._libraryResults = new Map<string, LibrarySearchResult>()
    }
}
