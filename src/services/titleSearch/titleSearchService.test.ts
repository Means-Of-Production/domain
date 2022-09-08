import {ILibrary, IThing, Person} from "../../entities"
import {ILibraryRepository} from "../../repositories"
import {anything, instance, mock, when} from "ts-mockito"
import {TitleSearchService} from "./titleSearchService"
import {TitleSearchRequest, ThingTitle} from "../../valueItems"

describe("thingSearchService", () => {
    it("removes duplicate titles", () => {
        const title1: ThingTitle = mock()
        when(title1.hash).thenReturn("hash1")

        const title2: ThingTitle = mock()
        when(title2.hash).thenReturn("another")

        const thing1: IThing = mock()
        when(thing1.title).thenReturn(instance(title1))

        const thing2: IThing = mock()
        when(thing2.title).thenReturn(instance(title2))

        const library: ILibrary = mock()
        when(library.getAvailableThings()).thenReturn([instance(thing1), instance(thing2)])

        const secondLibrary: ILibrary = mock()
        when(secondLibrary.getAvailableThings()).thenReturn([instance(thing1)])

        const libraryRepo: ILibraryRepository = mock()
        when(libraryRepo.getLibrariesPersonCanUse(anything())).thenReturn([instance(library), instance(secondLibrary)])

        const underTest = new TitleSearchService(instance(libraryRepo))

        const person: Person = mock()
        const searchRequest = new TitleSearchRequest();

        // act
        const res = Array.from(underTest.find(instance(person), searchRequest))

        expect(res).not.toBeNull()
        expect(res.length).toEqual(2)
    })
})
