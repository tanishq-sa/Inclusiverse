/**
 * Pricing logic for Chhichhore ticket booking.
 *
 * Person 1: ₹59
 * Person 2: ₹40
 * Person N (N≥2): ₹40
 *
 * Totals: 1→₹59, 2→₹99, 3→₹139, 4→₹179 ...
 */

export interface PriceBreakdownItem {
  person: number;
  label: string;
  cost: number;
}

export interface TicketPricing {
  breakdown: PriceBreakdownItem[];
  total: number;
}

export function getPersonCost(n: number): number {
  if (n === 1) return 59;
  return 40;
}

export function getTotal(count: number): number {
  return Array.from({ length: count }, (_, i) => getPersonCost(i + 1)).reduce(
    (sum, c) => sum + c,
    0
  );
}

export function useTicketPricing(attendeeCount: number): TicketPricing {
  const safeCount = Math.max(1, attendeeCount);

  const breakdown: PriceBreakdownItem[] = Array.from({ length: safeCount }, (_, i) => {
    const n = i + 1;
    const cost = getPersonCost(n);
    return {
      person: n,
      label: n === 1 ? "1st Person" : n === 2 ? "2nd Person" : `${n}th Person`,
      cost,
    };
  });

  const total = breakdown.reduce((sum, item) => sum + item.cost, 0);

  return { breakdown, total };
}
