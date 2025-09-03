import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { PerDayFeeSchedule } from "../../../src/value_items/fee_schedules/per_day_fee_schedule";
import { Money, Currency } from "../../../src/value_items/money";

describe("PerDayFeeSchedule.feeForOverdueItem", () => {
  const fixedToday = new Date("2025-09-05T12:34:56Z"); // arbitrary fixed date

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedToday);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("returns zero in same currency when no due date provided", () => {
    const schedule = new PerDayFeeSchedule({
      daily_charge: new Money({ amount: 10, currency: Currency.USD }),
    });

    const fee1 = schedule.feeForOverdueItem({});
    const fee2 = schedule.feeForOverdueItem({ due_date: null });
    const fee3 = schedule.feeForOverdueItem({ due_date: undefined });

    const zeroUSD = new Money({ amount: 0, currency: Currency.USD });

    expect(fee1.equals(zeroUSD)).toBe(true);
    expect(fee2.equals(zeroUSD)).toBe(true);
    expect(fee3.equals(zeroUSD)).toBe(true);
  });

  it("charges for the number of full overdue days when due_date is in the past (direct Date)", () => {
    // fixedToday is 2025-09-05 UTC; due date 2025-09-01 => 4 days overdue
    const schedule = new PerDayFeeSchedule({
      daily_charge: new Money({ amount: 5, currency: Currency.USD }),
    });

    const loan = { due_date: new Date(Date.UTC(2025, 8, 1)) };
    const fee = schedule.feeForOverdueItem(loan);

    const expected = new Money({ amount: 5 * 4, currency: Currency.USD });
    expect(fee.equals(expected)).toBe(true);
  });

  it("charges zero when due_date is today (no overdue)", () => {
    const schedule = new PerDayFeeSchedule({
      daily_charge: new Money({ amount: 7, currency: Currency.USD }),
    });

    const loan = { due_date: new Date(Date.UTC(2025, 8, 5)) }; // same day in UTC
    const fee = schedule.feeForOverdueItem(loan);

    const expected = new Money({ amount: 0, currency: Currency.USD });
    expect(fee.equals(expected)).toBe(true);
  });

  it("charges zero when due_date is in the future", () => {
    const schedule = new PerDayFeeSchedule({
      daily_charge: new Money({ amount: 3, currency: Currency.USD }),
    });

    const loan = { due_date: new Date(Date.UTC(2025, 8, 10)) }; // future
    const fee = schedule.feeForOverdueItem(loan);

    const expected = new Money({ amount: 0, currency: Currency.USD });
    expect(fee.equals(expected)).toBe(true);
  });

  it("supports due_date nested object with .date field", () => {
    const schedule = new PerDayFeeSchedule({
      daily_charge: new Money({ amount: 2, currency: Currency.USD }),
    });

    const loan = { due_date: { date: new Date(Date.UTC(2025, 8, 3)) } }; // 2 days overdue
    const fee = schedule.feeForOverdueItem(loan);

    const expected = new Money({ amount: 2 * 2, currency: Currency.USD });
    expect(fee.equals(expected)).toBe(true);
  });
});
