// encapsulates due dates, which are nullable.  Null is considered to be forever, i.e. the latest ever due
export class DueDate{
    readonly date: Date | null

    constructor(date: Date | null) {
        this.date = date
    }

    public isLaterThan(other: DueDate): boolean {
        if(!this.date){
            return other.date ? true : false
        }

        if(other.date && this.date){
            return this.date > other.date
        }

        return false
    }

    public equals(other: DueDate): boolean {
        if(!this.date && !other.date){
            return true
        }
        return this.date === other.date
    }

    public isBefore(other: DueDate): boolean {
        if(!other.date){
            return this.date ? true: false
        }

        if(this.date && other.date){
            return this.date < other.date
        }

        return false
    }
}