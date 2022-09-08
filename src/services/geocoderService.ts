import {PhysicalLocation} from "../valueItems/location";

export interface IGeocoderService{
    getCurrentLocation(searchString: string): PhysicalLocation
}