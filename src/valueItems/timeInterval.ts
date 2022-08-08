export class TimeInterval{
    public readonly milliseconds: number

    constructor(milliseconds: number) {
        this.milliseconds = milliseconds
    }

    public addToDate(date: Date): Date{
        date = new Date(date.getTime() + this.milliseconds)
        return date
    }

    public fromNow(): Date {
        return this.addToDate(new Date(Date.now()))
    }

    public static fromDays(days: number): TimeInterval{
        const milliseconds = days * 24 * 60 * 60 * 1000
        return new TimeInterval(milliseconds)
    }
}