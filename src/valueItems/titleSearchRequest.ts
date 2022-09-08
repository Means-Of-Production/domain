export class TitleSearchRequest {
    public readonly searchText: string | undefined

    constructor(searchText: string | undefined = undefined) {
        this.searchText = searchText
    }
}