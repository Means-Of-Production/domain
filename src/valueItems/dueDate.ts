/**
 * encapsulates due dates, which are nullable.  Null is considered to be forever, i.e. the latest ever due
 */
export class DueDate{
    readonly date: Date | null

    constructor(date: Date | null = null) {
        this.date = date
    }

    public isLaterThan(other: DueDate): boolean {
        if(!this.date){
            return !!other.date
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
            return !!this.date
        }

        if(this.date && other.date){
            return this.date < other.date
        }

        return false
    }

    public static compare(a: DueDate, b: DueDate): number {
        if(a.equals(b)){ return 0}
        return a.isLaterThan(b)? 1: -1
    }

    public static parse(s: string): DueDate {
        const date = Date.parse(s)
        return new DueDate(new Date(date))
    }
}