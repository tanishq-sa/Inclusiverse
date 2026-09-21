/**
 * Pricing logic for Chhichhore ticket booking.
 *
 * Base price: ₹59 per person
 * Group discounts applied as fixed totals:
 * 1 person → ₹49  (save ₹10)
 * 2 people → ₹99  (save ₹19)
 * 3 people → ₹139 (save ₹38)
 * 4 people → ₹179 (save ₹57)
 * 5 people → ₹209 (save ₹86)
 */

export const BASE_PRICE_PER_PERSON = 59;

export interface PriceBreakdownItem {
  person: number;
  label: string;
  cost: number; // base cost per person (always 59)
}

export interface TicketPricing {
  breakdown: PriceBreakdownItem[];
  originalTotal: number; // full price without discount (59 × count)
  total: number;         // discounted total
  savings: number;       // how much they save
}

const FIXED_TOTALS: Record<number, number> = {
  1: 49,
  2: 99,
  3: 139,
  4: 179,
  5: 209,
};

export function getTotal(count: number): number {
  const clamped = Math.min(Math.max(1, count), 5);
  return FIXED_TOTALS[clamped] || 49;
}

export function useTicketPricing(attendeeCount: number): TicketPricing {
  const safeCount = Math.min(Math.max(1, attendeeCount), 5);

  const breakdown: PriceBreakdownItem[] = Array.from({ length: safeCount }, (_, i) => {
    const n = i + 1;
    return {
      person: n,
      label: n === 1 ? "1st Person" : n === 2 ? "2nd Person" : n === 3 ? "3rd Person" : `${n}th Person`,
      cost: BASE_PRICE_PER_PERSON,
    };
  });

  const originalTotal = safeCount * BASE_PRICE_PER_PERSON;
  const total = FIXED_TOTALS[safeCount] || 49;
  const savings = originalTotal - total;

  return { breakdown, originalTotal, total, savings };
}
