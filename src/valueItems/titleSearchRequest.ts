export class TitleSearchRequest {
    readonly name: string | undefined

    constructor(name: string | undefined) {
        this.name = name
    }
}