export interface ILocation {}

export class Distance {
    private static readonly MILES_CONVERSION = .6214
    private readonly _value: number

    private constructor(kilometers: number){
        this._value = kilometers
    }

    public get kilometers(): number{
        return this._value
    }

    public get miles(): number {
        return this._value * Distance.MILES_CONVERSION
    }

    public equals(other: Distance){
        return this.kilometers == other.kilometers
    }

    public lessThan(other: Distance){
        return this.kilometers < other.kilometers
    }

    public static fromKilometers(kilometers: number){
        return new Distance(kilometers)
    }

    public static fromMiles(miles: number){
        return new Distance(miles/Distance.MILES_CONVERSION)
    }
}

/**
 * A precise physical location
 */
export class PhysicalLocation implements ILocation {
    public readonly latitude: number
    public readonly longitude: number
    public readonly address: string | null

    constructor(latitude: number, longitude: number, address: string | null = null) {
        this.latitude = latitude
        this.longitude = longitude
        this.address = address
    }
}

/**
 * This doesn't have an exact location, but is tied to a geography area
 */
export class DistributedLocation implements ILocation{
    public readonly centerPoint: PhysicalLocation
    public readonly radius: Distance
    
    constructor(centerPoint: PhysicalLocation, radius: Distance){
        this.centerPoint = centerPoint
        this.radius = radius
    }
}

/**
 * Shows that this thing exists ONLY online, and has no physical boundary
 */
export class Virtual implements ILocation {
    
}