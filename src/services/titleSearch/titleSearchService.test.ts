import {ILibrary, IThing, Person} from "../../entities"
import {ILibraryRepository} from "../../repositories"
import {anything, instance, mock, when} from "ts-mockito"
import {TitleSearchService} from "./titleSearchService"
import {TitleSearchRequest, ThingTitle} from "../../valueItems"

describe("thingSearchService", () => {
    it("removes duplicate titles", () => {
        const title1 = new ThingTitle("hash1")

        const title2: ThingTitle = new ThingTitle("another")

        const thing1: IThing = mock()
        when(thing1.title).thenReturn(title1)

        const thing2: IThing = mock()
        when(thing2.title).thenReturn(title2)

        const library: ILibrary = mock()
        when(library.id).thenReturn("first")
        when(library.getAvailableThings()).thenReturn([instance(thing1), instance(thing2)])

        const thing3: IThing = mock()
        when(thing3.title).thenReturn(title1)

        const secondLibrary: ILibrary = mock()
        when(secondLibrary.id).thenReturn("second")
        when(secondLibrary.getAvailableThings()).thenReturn([instance(thing3)])

        const libraryRepo: ILibraryRepository = mock()
        when(libraryRepo.getLibrariesPersonCanUse(anything())).thenReturn([instance(library), instance(secondLibrary)])

        const underTest = new TitleSearchService(instance(libraryRepo))

        const person: Person = mock()
        const searchRequest = new TitleSearchRequest();

        // act
        const resGen = underTest.find(instance(person), searchRequest)
        const res = Array.from(resGen)

        expect(res).not.toBeNull()
        expect(res.length).toEqual(2)

        const resTitle1Lib1 = res[0].getForLibrary(instance(library))
        expect(Array.from(resTitle1Lib1.things).length).toEqual(1)

        const resTitle1Lib2 = res[0].getForLibrary(instance(secondLibrary))
        expect(Array.from(resTitle1Lib2.things).length).toEqual(1)

        const resTitle2Lib1 = res[1].getForLibrary(instance(library))
        expect(Array.from(resTitle2Lib1.things).length).toEqual(1)
    })
})
