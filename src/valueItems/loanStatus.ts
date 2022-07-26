export enum LoanStatus {
    BORROWED, // someone is borrowing this
    OVERDUE, // someone borrowed this and hasn't returned it on time
    RETURN_STARTED, // the borrower has submitted the item for return
    WAITING_ON_LENDER_ACCEPTANCE,  // the borrower gave this to the lender, but they haven't marked it done yet
    RETURNED_DAMAGED, // someone borrowed this and fucked it up
    RETURNED // someone borrow this and actually brought it back correct
}