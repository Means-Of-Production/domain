import {binding, given, then, when} from 'cucumber-tsflow'
import {SimpleLibrary} from "../../dist/entities/libraries/simpleLibrary";
import {Person} from "../../src/entities/people/person";
import {PersonName} from "../../src/valueItems/personName";
import {WaitingListFactory} from "../../src/factories/waitingListFactory";
import {USDMoney} from "../../src/valueItems/money/USDMoney";

@binding()
export class SimpleLibrarySteps {
    private library: SimpleLibrary

    @given("the library has a title of /\$(\s*)")
    public givenTheLibraryHasATitle(title: string){
        this.library = new SimpleLibrary(
            "testLibrary",
            new Person("`1", new PersonName("Testy", "McTesterson")),
            null,
            [],
            [],
            new WaitingListFactory(),
            new USDMoney(0),
            []
        );
    }
}