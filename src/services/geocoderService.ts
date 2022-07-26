import {PhysicalLocation} from "../valueItems/physicalLocation";

export interface IGeocoderService{
    getLocation(searchString: string): PhysicalLocation
}