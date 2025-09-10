# Domain Model

This document describes the core domain model found in this repository. It lists the items under src/entities and src/value_items (and notable subfolders) and gives a concise description for each.

Note: Type names are written in TypeScript. Many value items are simple value objects or enums used by the entity layer.

## Entities
All IDs are uuid/guid

- Borrower (src/entities/borrower.ts)
  - A person or organization that can borrow a Thing.
  - Fields
    - borrower_id (ID), 
    - name 
    - verification_flags
      - this shows what things the borrower has done to verify their identity.  Libraries use this to determine if they wish to lend or not

- Thing (src/entities/thing.ts)
  - Represents anything that can be borrowed, given, or used by the library
  - Fields
    - thing_id (ID), 
    - title - name of the thing, 
    - description, 
    - owner_id (ID) - id of the lender who owns the item.  Might be a person, a library, 
    - storage_location - where the thing is stored,  Could be virtual for electronice goods, 
    - image_urls - images of the item 
    - purchase_cost (Money) - optional, how much the item is worth, cost to replace, etc, 
    - status (ThingStatus, guarded by state transitions) - READY, BORROWED, RESERVED, DAMAGED
      - Status transitions are enforced: 
        - READY -> BORROWED/RESERVED 
        - BORROWED -> READY/RESERVED/DAMAGED
        - RESERVED -> READY/BORROWED 
        - DAMAGED -> (terminal, must be repaired first)

- Loan (src/entities/loan.ts)
  - Represents a borrowing of a Thing by a Borrower.
  - Fields
    - loan_id, item (Thing), 
    - due_date (DueDate) - note this is optional.  Gifts are loans without a due date!
    - borrower_id (ID) who borrowed the item
    - return_location (Location) - where the item is to be returned 
    - time_returned (Date|null), 
    - status (LoanStatus with guarded transitions)
      - BORROWED
      - OVERDUE
      - RETURN_STARTED
      - WAITING_ON_LENDER_ACCEPTANCE
      - RETURNED_DAMAGED
      - RETURNED 
  - Methods
    - borrow() - sets due_date if not provided, creates Loan, transitions statuses, and records the loan.
    - return() - transitions status to RETURN_STARTED, sets time_returned, and records the return.
    - finish_library_return() - transitions status to RETURNED, records the return, and calculates fees.

- Libraries
  - Library (abstract) (src/entities/libraries/library.ts)
    - Root abstraction for a lending institution.
    - Fields: library_id (ID), name, administrator (Person), waiting_list_type, waiting_lists_by_item_id, max_fines_before_suspension (Money), fee_schedule (FeeSchedule), default_loan_time ({days}), mop_server (MOPServer), public_url.
    - Collections: borrowers, loans. Methods for borrowing workflow, item reservation, loan return processing and fee calculation.
    - Fee calculation defers to FeeSchedule for overdue/damaged cases and records LibraryFee against the borrower.
  - SimpleLibrary (src/entities/libraries/simple_library.ts)
    - Concrete Library that directly manages a local collection of Things.
    - Tracks items in-memory; borrow() sets due_date if not provided, creates Loan, transitions statuses, and records the loan.
  - DistributedLibrary (src/entities/libraries/distributed_library.ts)
    - Library composed of multiple Lenders. Aggregates Things from all lenders; routes borrow/return operations to the owning Lender while handling library-level logic (fees, waiting lists).

- Lender (abstract) (src/entities/lenders/lender.ts)
  -  A person or organization (including Libraries) that can loan out an item to others

- LibraryFee (src/entities/libraries/library_fee.ts)
  - A fee charged by a Library as relates to a Loan - usually for late or damaged items

- People
  - Person (src/entities/people/person.ts)
    - Generic base of an actual physical person.  Might be a User, Borrower, Lender, etc
  - PersonBorrower (src/entities/people/person_borrower.ts)
    - A Person acting as a Borrower for a specific Library (library_id).
    - Tracks verification flags and applied LibraryFees.

- Waiting Lists
  - WaitingList (abstract) (src/entities/waiting_lists/waiting_list.ts)
    - Manages a queue for a Thing when demand exceeds availability.
    - Holds current_reservation and expired_reservations; supports adding/cancelling borrowers, assigning reservations, and computing reservation durations.
    - reserve_item_for_next_borrower() selects the next borrower, marks the Thing as RESERVED, creates a Reservation, and removes the borrower from the list.
  - Reservation (src/entities/waiting_lists/waiting_list.ts)
    - Represents a hold window for a borrower to claim a Thing.
    - Fields: reservation_id, holder (Borrower), item (Thing), good_until (Date), status (ReservationStatus with guarded transitions: ASSIGNED -> BORROWER_NOTIFIED -> EXPIRED/BORROWED).
  - FirstComeFirstServeWaitingList (src/entities/waiting_lists/first_come_first_serve_waiting_list.ts)
    - Simple FIFO waiting list. Configurable reservation_days; can expire reservations and clear current reservation.
  - NullWaitingList (src/entities/waiting_lists/null_waiting_list.ts)
    - No-op waiting list implementation used when waiting list functionality is disabled.

- LibraryServer - a basic representation of a server of a library.  Used for Federation


## Value Items
- Money and Currency
  - Money (src/value_items/money.ts)
    - How much money something is.  Done as this to avoid errors with different currencies
    - Supported currencies: EUR, USD, HOUR (labor token/timebank models).

- Dates and Due Dates
  - DueDate (src/value_items/due_date.ts) - when an item is due

- Fees
  - FeeStatus (src/value_items/fee_status.ts)
    - OUTSTANDING, PAID, IN_PAYMENT, FORGIVEN.
  - FeeSchedule (interface) (src/value_items/fee_schedules/fee_schedule.ts) - strategy for how we generate fees for a library, can vary between libraries.
    - PerDayFeeSchedule (src/value_items/fee_schedules/per_day_fee_schedule.ts)
      - Charges a daily fee (Money) for each full day past due. If no due date, returns zero in the same currency.

- Loans
  - LoanStatus (src/value_items/loan_status.ts)
    - BORROWED, OVERDUE, RETURN_STARTED, WAITING_ON_LENDER_ACCEPTANCE, RETURNED_DAMAGED, RETURNED.

- Reservations
  - ReservationStatus (src/value_items/reservation_status.ts)
    - ASSIGNED, BORROWER_NOTIFIED, EXPIRED, BORROWED, CANCELLED.

- Things
  - ThingStatus (src/value_items/thing_status.ts)
    - READY, BORROWED, RESERVED, DAMAGED.
  - ThingTitle (src/value_items/thing_title.ts)
    - Value object for a Thing’s title, can determine if two titles are equal

- People and Contact
  - PersonName (src/value_items/person_name.ts)
    - Person’s name - deals with first names, middles, suffix, etc
  - EmailAddress (src/value_items/email_address.ts)
    - Email address value object with basic validation/equality.

- Locations
  - Location (interface) (src/value_items/location/location.ts)
    - Abstraction for any form of location
  - PhysicalLocation (src/value_items/location/physical_location.ts)
    - Street address plus optional lat/long. Supports equality and distance calculations (Haversine), and contains() for same location.
  - PhysicalArea (src/value_items/location/physical_area.ts)
    - Circular area defined by center_point and radius (Distance). contains() supports PhysicalLocation and PhysicalArea comparisons.
    - Later we might move this to polygons, etc.
  - VirtualLocation (src/value_items/location/virtual_location.ts)
    - URL-backed location; contains() checks URL equality.
  - Distance (src/value_items/location/distance.ts)
    - Scalar distance object with comparisons and arithmetic helpers.

- Search and Titles
  - TitleSearchRequest (src/value_items/title_search_request.ts)
    - Encapsulates parameters for searching titles.
  - TitleSearchResult (src/value_items/title_search_result.ts)
    - Encapsulates the result of a title search.

- URLs and Roles
  - URL (src/value_items/url.ts)
    - Value object for URLs with equality.
  - UserRoles (src/value_items/user_roles.ts)
    - Role enum/values for authorization scenarios.

- Waiting Lists
  - WaitingListType (src/value_items/waiting_list_types.ts)
    - Enumerates/list types available to Library/WaitingListFactory integration.

- Auction
  - AuctionBid (src/value_items/auction_bid.ts)
    - Value object capturing a bid and settlement for auctions in more advanced waiting lists

- Exceptions (src/value_items/exceptions.ts)
  - Several domain exceptions including state transition and currency mismatch errors.


## Notes
- FeeSchedule implementations can be expanded (e.g., damaged item fees) in the future; Library.finish_library_return will pick the appropriate implementation if present.
