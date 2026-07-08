"use strict";
/**
 * UTILITIES
 * Small, reusable, pure helper functions used across the engine.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
exports.formatCurrency = formatCurrency;
exports.formatDate = formatDate;
exports.calculatePercentage = calculatePercentage;
exports.calculateTax = calculateTax;
exports.calculateDiscount = calculateDiscount;
exports.round2 = round2;
let idCounter = 0;
/**
 * Generates a unique, prefixed id.
 * Uses a monotonic counter + timestamp so ids are unique even
 * when generated in a tight loop (e.g. seeding sample data).
 */
function generateId(prefix = "id") {
    idCounter += 1;
    return `${prefix}_${Date.now().toString(36)}_${idCounter.toString(36)}`;
}
/**
 * Formats a number as currency. Defaults to INR (₹) since BusinessOS
 * targets small/medium businesses, but any locale/currency can be passed.
 */
function formatCurrency(amount, currency = "INR", locale = "en-IN") {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}
/**
 * Formats an ISO date string into a human readable date (e.g. 05 Jul 2026).
 */
function formatDate(isoDate) {
    const d = new Date(isoDate);
    if (isNaN(d.getTime()))
        return "Invalid Date";
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}
/**
 * Calculates what percentage `value` is of `total`. Returns 0 if total is 0.
 */
function calculatePercentage(value, total) {
    if (!total)
        return 0;
    return Math.round((value / total) * 10000) / 100; // 2 decimal precision
}
/**
 * Calculates tax amount for a given price and tax rate (%).
 */
function calculateTax(price, taxRatePercent) {
    return Math.round(price * (taxRatePercent / 100) * 100) / 100;
}
/**
 * Calculates the discounted price for a given price and discount rate (%).
 */
function calculateDiscount(price, discountPercent) {
    const discounted = price - price * (discountPercent / 100);
    return Math.round(discounted * 100) / 100;
}
/**
 * Rounds a number to 2 decimal places (currency-safe rounding).
 */
function round2(value) {
    return Math.round(value * 100) / 100;
}
//# sourceMappingURL=index.js.map