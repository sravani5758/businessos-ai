/**
 * UTILITIES
 * Small, reusable, pure helper functions used across the engine.
 */

let idCounter = 0;

/**
 * Generates a unique, prefixed id.
 * Uses a monotonic counter + timestamp so ids are unique even
 * when generated in a tight loop (e.g. seeding sample data).
 */
export function generateId(prefix: string = "id"): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter.toString(36)}`;
}

/**
 * Formats a number as currency. Defaults to INR (₹) since BusinessOS
 * targets small/medium businesses, but any locale/currency can be passed.
 */
export function formatCurrency(
  amount: number,
  currency: string = "INR",
  locale: string = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats an ISO date string into a human readable date (e.g. 05 Jul 2026).
 */
export function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "Invalid Date";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Calculates what percentage `value` is of `total`. Returns 0 if total is 0.
 */
export function calculatePercentage(value: number, total: number): number {
  if (!total) return 0;
  return Math.round((value / total) * 10000) / 100; // 2 decimal precision
}

/**
 * Calculates tax amount for a given price and tax rate (%).
 */
export function calculateTax(price: number, taxRatePercent: number): number {
  return Math.round(price * (taxRatePercent / 100) * 100) / 100;
}

/**
 * Calculates the discounted price for a given price and discount rate (%).
 */
export function calculateDiscount(price: number, discountPercent: number): number {
  const discounted = price - price * (discountPercent / 100);
  return Math.round(discounted * 100) / 100;
}

/**
 * Rounds a number to 2 decimal places (currency-safe rounding).
 */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
