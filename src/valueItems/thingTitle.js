"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThingTitle = void 0;
class ThingTitle {
    name;
    isbn;
    upc;
    description;
    constructor(name, isbn, upc, description) {
        this.name = name;
        this.upc = upc;
        this.isbn = isbn;
        this.description = description;
    }
    equals(other) {
        if (!other) {
            return false;
        }
        if (other.name !== this.name) {
            return false;
        }
        if (other.upc && this.upc && this.upc !== other.upc) {
            return false;
        }
        if (other.isbn && this.isbn && this.isbn != other.isbn) {
            return false;
        }
        return true;
    }
    get hash() {
        return this.name + "|" + this.upc + "|" + this.isbn;
    }
}
exports.ThingTitle = ThingTitle;
