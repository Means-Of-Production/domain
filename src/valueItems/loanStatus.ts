export enum LoanStatus {
    REQUESTED, // someone wants to borrow this
    LOANED, // someone is borrowing this
    OVERDUE, // someone borrowed this and hasn't returned it on time
    WRITTEN_OFF, // someone borrowed this and never returned it
    RETURN_STARTED, // the borrower has submitted the item for return
    WAITING_ON_LENDER_ACCEPTANCE,  // the borrower gave this to the lender, but they haven't marked it done yet
    RETURNED_DAMAGED, // someone borrowed this and fucked it up
    RETURNED // someone borrow this and actually brought it back correct
}