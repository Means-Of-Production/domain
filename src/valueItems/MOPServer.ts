import {VirtualLocation} from "./location"

export class MOPServer extends VirtualLocation {
    public readonly version: string

    constructor(url: URL, version: string) {
        super(url)
        this.version = version
    }

    public static get localhost(): MOPServer{
        return new MOPServer(
            new URL("https://localhost"),
            "0.0.0"
        )
    }
}