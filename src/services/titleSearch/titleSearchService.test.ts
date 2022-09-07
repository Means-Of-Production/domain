import {ILibrary, Person} from "../../entities"
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

        const library: ILibrary = mock()
        when(library.availableTitles).thenReturn([instance(title1), instance(title2)])

        const secondLibrary: ILibrary = mock()
        when(secondLibrary.availableTitles).thenReturn([instance(title1)])

        const libraryRepo: ILibraryRepository = mock()
        when(libraryRepo.getLibrariesPersonCanUse(anything())).thenReturn([instance(library), instance(secondLibrary)])

        const underTest = new TitleSearchService(instance(libraryRepo))

        const person: Person = mock()
        const searchRequest: TitleSearchRequest = mock()
        when(searchRequest.matches(anything())).thenReturn(true);

        // act
        const res = Array.from(underTest.find(instance(person), instance(searchRequest)))

        expect(res).not.toBeNull()
        expect(res.length).toEqual(2)
    })
})
