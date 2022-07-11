"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thing = void 0;
const thingStatus_1 = require("../../valueItems/thingStatus");
class Thing {
    id;
    description;
    storageLocation;
    imageUrls;
    _status = thingStatus_1.ThingStatus.READY;
    owner;
    insuredAmount = null;
    requiredBorrowerFlags;
    title;
    constructor(id, title, storageLocation, owner, currentStatus = thingStatus_1.ThingStatus.READY, description = "", imageUrls = [], insuredAmount, requiredBorrowerFlags = []) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrls = imageUrls;
        this._status = currentStatus;
        this.owner = owner;
        this.storageLocation = storageLocation;
        this.insuredAmount = insuredAmount;
        this.requiredBorrowerFlags = requiredBorrowerFlags;
    }
    get status() {
        return this._status;
    }
    set status(status) {
        this._status = status;
    }
}
exports.Thing = Thing;
