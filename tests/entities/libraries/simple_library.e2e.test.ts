import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SimpleLibrary } from "../../../src";
import {
  ID,
  DueDate,
  LoanStatus,
  ThingStatus,
  ThingTitle,
  WaitingListType,
} from "../../../src";
import { Person } from "../../../src";
import { PersonName } from "../../../src";
import { URL } from "../../../src";
import { MOPServer } from "../../../src";
import { Money, Currency } from "../../../src";
import { MoneyFactory } from "../../../src";
import { FeeSchedule } from "../../../src";
import { Thing } from "../../../src";
import { PhysicalLocation } from "../../../src";
import { PersonBorrower } from "../../../src";

class TestFeeSchedule implements FeeSchedule {
  feeForOverdueItem() {
    return new Money({ amount: 5, currency: Currency.USD });
  }
  feeForDamagedItem() {
    return new Money({ amount: 20, currency: Currency.USD });
  }
}

function makeLibrary() {
  const admin = new Person({
    person_id: ID.generate(),
    name: new PersonName({ first_name: "Admin", last_name: "User" }),
  });
  const fee_schedule = new TestFeeSchedule();
  const mop_server = MOPServer.localhost();

  const lib = new SimpleLibrary({
    library_id: ID.generate(),
    name: "Test Simple Library",
    administrator: admin,
    waiting_list_type: WaitingListType.FIRST_COME_FIRST_SERVE as any,
    max_fines_before_suspension: new Money({ amount: 50, currency: Currency.USD }),
    fee_schedule,
    default_loan_time: { days: 14 },
    mop_server,
    public_url: URL.parse("https://example.com") as any,
  });
  lib.location = new PhysicalLocation({
    street_address: "1 Main",
    city: "X",
    state: "Y",
    zip_code: "00000",
    country: "US",
  });
  (lib as any).money_factory.default_currency = Currency.USD;
  return lib;
}

function makeThing(): Thing {
  return new Thing({
    thing_id: ID.generate(),
    title: new ThingTitle({ name: "Test Book" }),
    description: null,
    owner_id: ID.generate(),
    storage_location: new PhysicalLocation({
      street_address: "1 Main",
      city: "X",
      state: "Y",
      zip_code: "00000",
      country: "US",
    }),
  });
}

function makeBorrower(lib: SimpleLibrary): PersonBorrower {
  const borrower = new PersonBorrower({
    person_id: ID.generate(),
    name: new PersonName({ first_name: "B", last_name: "R" }),
    emails: null as any,
    library_id: lib.library_id,
    verification_flags: null as any,
  });
  borrower.library_id = lib.entity_id;

  return borrower;
}

describe("SimpleLibrary end-to-end", () => {
  let useFake = false;
  beforeEach(() => {
    // reset timers
    vi.useRealTimers();
    useFake = false;
  });
  afterEach(() => {
    if (useFake) vi.useRealTimers();
  });

  it("borrow and return", async () => {
    const lib = makeLibrary();
    const thing = makeThing();
    const borrower = makeBorrower(lib);
    lib.add_item(thing);

    // Ensure can_borrow allows our synthetic borrower
    const original = lib.can_borrow.bind(lib);
    (lib as any).can_borrow = () => true;

    const loan = await lib.borrow(thing, borrower);

    expect(loan).toBeTruthy();
    expect(loan.status).toBe(LoanStatus.BORROWED);
    expect(thing.status).toBe(ThingStatus.BORROWED);

    const afterStart = await lib.start_return(loan);
    expect(afterStart.status).toBe(LoanStatus.WAITING_ON_LENDER_ACCEPTANCE);

    const finished = await lib.finish_library_return(afterStart, borrower);
    expect(finished.status).toBe(LoanStatus.RETURNED);
    expect(thing.status).toBe(ThingStatus.READY);

    (lib as any).can_borrow = original;
  });

  it("borrow and return overdue assigns fee", async () => {
    const lib = makeLibrary();
    const thing = makeThing();
    const borrower = makeBorrower(lib);
    lib.add_item(thing);

    const original = lib.can_borrow.bind(lib);
    (lib as any).can_borrow = () => true;

    const loan = await lib.borrow(thing, borrower);
    expect(loan.due_date).toBeTruthy();
    expect(loan.status).toBe(LoanStatus.BORROWED);
    expect(thing.status).toBe(ThingStatus.BORROWED);

    // Move time forward past due date
    useFake = true;
    vi.useFakeTimers();
    const pastDue = new Date((loan.due_date!.date as Date).getTime() + 24 * 60 * 60 * 1000);
    vi.setSystemTime(pastDue);

    // Start and finish return; finish_library_return uses time_returned recorded during start_return
    const afterStart = await lib.start_return(loan);
    expect(afterStart.status).toBe(LoanStatus.WAITING_ON_LENDER_ACCEPTANCE);

    const finished = await lib.finish_library_return(afterStart, borrower);
    expect(finished.status).toBe(LoanStatus.OVERDUE);
    expect(thing.status).toBe(ThingStatus.READY);

    expect(borrower.fees.length).toBe(1);

    (lib as any).can_borrow = original;
  });
});
