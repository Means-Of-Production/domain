import {PhysicalArea, PhysicalLocation} from "../valueItems/location"

export interface IGeocoderService{
    getCurrentLocation(searchString: string): PhysicalLocation

    isWithin(location: PhysicalLocation, area: PhysicalArea): boolean
}