import {ThingTitle} from "./thingTitle";

export class TitleSearchRequest {
    public readonly searchText: string | undefined

    constructor(searchText: string | undefined = undefined) {
        this.searchText = searchText
    }

    public matches(title: ThingTitle): boolean {
        if(this.name) {
            return title.name.includes(this.name)
        }
        return true
    }
}