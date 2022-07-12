"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrower = void 0;
// this is effectively the library card
class Borrower {
    id;
    verificationFlags;
    person;
    constructor(id, person, library, verificationFlags = [], fees = []) {
        this.person = person;
        this.verificationFlags = verificationFlags;
        this.library = library;
        this.fees = fees;
        this.id = id;
    }
    fees;
    library;
}
exports.Borrower = Borrower;
