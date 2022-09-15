export class MOPServer {
    public readonly URL: URL
    public readonly version: string

    constructor(url: URL, version: string) {
        this.URL = url
        this.version = version
    }

    public static get localhost(): MOPServer{
        return new MOPServer(
            new URL("https://localhost"),
            "0.0.0"
        )
    }
}