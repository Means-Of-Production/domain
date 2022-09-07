import {ThingTitle} from "./thingTitle";

export class TitleSearchRequest {
    readonly name: string | undefined

    constructor(name: string | undefined) {
        this.name = name
    }

    public matches(title: ThingTitle): boolean {
        if(this.name) {
            return title.name.includes(this.name)
        }
        return true
    }
}