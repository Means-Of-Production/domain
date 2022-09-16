import {PersonName, EmailAddress} from "../../valueItems"

export class Person {
    public readonly id: string
    public readonly name: PersonName
    public readonly emails: EmailAddress[]

    constructor(id: string, name: PersonName, emails: EmailAddress[] = []) {
        this.id = id
        this.name = name
        this.emails = emails
    }

    public equals(other: Person) : boolean{
        if(!other){
            return false
        }
        return this.id === other.id
    }
}

