/**
 * UTILITIES
 * Small, reusable, pure helper functions used across the engine.
 */
/**
 * Generates a unique, prefixed id.
 * Uses a monotonic counter + timestamp so ids are unique even
 * when generated in a tight loop (e.g. seeding sample data).
 */
export declare function generateId(prefix?: string): string;
/**
 * Formats a number as currency. Defaults to INR (₹) since BusinessOS
 * targets small/medium businesses, but any locale/currency can be passed.
 */
export declare function formatCurrency(amount: number, currency?: string, locale?: string): string;
/**
 * Formats an ISO date string into a human readable date (e.g. 05 Jul 2026).
 */
export declare function formatDate(isoDate: string): string;
/**
 * Calculates what percentage `value` is of `total`. Returns 0 if total is 0.
 */
export declare function calculatePercentage(value: number, total: number): number;
/**
 * Calculates tax amount for a given price and tax rate (%).
 */
export declare function calculateTax(price: number, taxRatePercent: number): number;
/**
 * Calculates the discounted price for a given price and discount rate (%).
 */
export declare function calculateDiscount(price: number, discountPercent: number): number;
/**
 * Rounds a number to 2 decimal places (currency-safe rounding).
 */
export declare function round2(value: number): number;
