import { describe, it, expect } from "vitest";
import { SimpleLibrary } from "../../../src";
import {
  ID,
  DueDate,
  LoanStatus,
  ThingStatus,
  ThingTitle,
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
import {PersonBorrower} from "../../../src";

class TestFeeSchedule implements FeeSchedule {
  feeForOverdueItem(): Money {
    return new Money({ amount: 5, currency: Currency.USD });
  }
  feeForDamagedItem(): Money {
    return new Money({ amount: 20, currency: Currency.USD });
  }
}

describe("SimpleLibrary", () => {
  function makeLibrary() {
    const admin = new Person({
      person_id: ID.generate(),
      name: new PersonName({ first_name: "Admin", last_name: "User" }),
    });
    const fee_schedule = new TestFeeSchedule();
    const money_factory = new MoneyFactory();
    const mop_server = MOPServer.localhost();

    const lib = new SimpleLibrary({
      library_id: ID.generate(),
      name: "Test Simple Library",
      administrator: admin,
      waiting_list_type: 0 as any, // WaitingListType.FIRST_COME_FIRST_SERVE
      max_fines_before_suspension: new Money({
        amount: 50,
        currency: Currency.USD,
      }),
      fee_schedule,
      default_loan_time: { days: 14 },
      mop_server,
      public_url: URL.parse("https://example.com"),
    });
    lib.location = new PhysicalLocation({
      street_address: "1 Main",
      city: "X",
      state: "Y",
      zip_code: "00000",
      country: "US",
    });
    // ensure default currency aligns with max_fines currency to avoid mismatch when borrower has no fees
    lib.money_factory.default_currency = Currency.USD;
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

  it("borrows when thing ready and borrower in good standing", async () => {
    const lib = makeLibrary();
    const thing = makeThing();
    const borrower = new PersonBorrower({
      person_id: ID.generate(),
      name: new PersonName({ first_name: "B", last_name: "R" }),
      emails: null,
      library_id: lib.library_id,
      verification_flags: null as any,
    });
    borrower.library_id = lib.entity_id; // minimal borrower shape
    borrower.apply_fee = () => borrower;

    lib.add_item(thing);
    const until = new DueDate({ date: new Date(Date.now() + 3 * 86400000) });
    const loan = await lib.borrow(thing, borrower, until);
    expect(loan.status).toBe(LoanStatus.BORROWED);
    expect(thing.status).toBe(ThingStatus.BORROWED);
  });
});
