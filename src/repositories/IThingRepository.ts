import { IRepository } from "./IRepository";
import {IThing} from "../entities/things/IThing";

export interface IThingRepository extends IRepository<IThing>{
}