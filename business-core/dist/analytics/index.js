"use strict";
/**
 * ANALYTICS MODULE
 * Pure functions that derive business insight from raw data
 * (orders, products, expenses). No side effects, no storage.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRevenue = calculateRevenue;
exports.calculateProfit = calculateProfit;
exports.calculateExpenses = calculateExpenses;
exports.calculateGrowth = calculateGrowth;
exports.calculateInventoryWorth = calculateInventoryWorth;
exports.topSellingProducts = topSellingProducts;
exports.worstSellingProducts = worstSellingProducts;
exports.dailySales = dailySales;
exports.monthlySales = monthlySales;
exports.yearlySales = yearlySales;
const utils_1 = require("../utils");
const COMPLETED = (o) => o.status === "Completed";
/**
 * Total revenue from completed orders, optionally within a date range.
 */
function calculateRevenue(orders, from, to) {
    const total = orders
        .filter(COMPLETED)
        .filter((o) => inRange(new Date(o.orderDate), from, to))
        .reduce((sum, o) => sum + o.total, 0);
    return (0, utils_1.round2)(total);
}
/**
 * Total cost-of-goods-sold for completed orders — used to derive profit.
 */
function calculateCOGS(orders, products, from, to) {
    const productMap = new Map(products.map((p) => [p.id, p]));
    let cogs = 0;
    for (const order of orders) {
        if (!COMPLETED(order) || !inRange(new Date(order.orderDate), from, to))
            continue;
        for (const line of order.products) {
            const product = productMap.get(line.productId);
            if (product)
                cogs += product.costPrice * line.quantity;
        }
    }
    return cogs;
}
/**
 * Gross profit = revenue - cost of goods sold - operating expenses.
 */
function calculateProfit(orders, products, expenses, from, to) {
    const revenue = calculateRevenue(orders, from, to);
    const cogs = calculateCOGS(orders, products, from, to);
    const opex = calculateExpenses(expenses, from, to);
    return (0, utils_1.round2)(revenue - cogs - opex);
}
/**
 * Total expenses, optionally within a date range.
 */
function calculateExpenses(expenses, from, to) {
    const total = expenses
        .filter((e) => inRange(new Date(e.expenseDate), from, to))
        .reduce((sum, e) => sum + e.amount, 0);
    return (0, utils_1.round2)(total);
}
/**
 * Calculates % growth in revenue between two periods.
 * Positive = grew, negative = shrank.
 */
function calculateGrowth(orders, previousPeriod, currentPeriod) {
    const previous = calculateRevenue(orders, previousPeriod.from, previousPeriod.to);
    const current = calculateRevenue(orders, currentPeriod.from, currentPeriod.to);
    if (previous === 0)
        return current > 0 ? 100 : 0;
    return (0, utils_1.round2)(((current - previous) / previous) * 100);
}
/**
 * Total worth of current inventory, valued at selling price
 * (contrast with inventoryService.calculateInventoryValue, which uses cost price).
 */
function calculateInventoryWorth(products) {
    const total = products.reduce((sum, p) => sum + p.sellingPrice * p.stock, 0);
    return (0, utils_1.round2)(total);
}
function rankProductSales(orders) {
    const map = new Map();
    for (const order of orders) {
        if (!COMPLETED(order))
            continue;
        for (const line of order.products) {
            const existing = map.get(line.productId) ?? {
                productId: line.productId,
                unitsSold: 0,
                revenue: 0,
            };
            existing.unitsSold += line.quantity;
            existing.revenue += line.unitPrice * line.quantity;
            map.set(line.productId, existing);
        }
    }
    return Array.from(map.values());
}
/**
 * Returns the top N best-selling products by units sold.
 */
function topSellingProducts(orders, limit = 5) {
    return rankProductSales(orders)
        .sort((a, b) => b.unitsSold - a.unitsSold)
        .slice(0, limit)
        .map((p) => ({ ...p, revenue: (0, utils_1.round2)(p.revenue) }));
}
/**
 * Returns the bottom N worst-selling products by units sold.
 * Only considers products that have sold at least once.
 */
function worstSellingProducts(orders, limit = 5) {
    return rankProductSales(orders)
        .sort((a, b) => a.unitsSold - b.unitsSold)
        .slice(0, limit)
        .map((p) => ({ ...p, revenue: (0, utils_1.round2)(p.revenue) }));
}
/**
 * Groups completed order revenue by calendar day (YYYY-MM-DD).
 */
function dailySales(orders) {
    return groupSalesBy(orders, (d) => d.toISOString().slice(0, 10));
}
/**
 * Groups completed order revenue by calendar month (YYYY-MM).
 */
function monthlySales(orders) {
    return groupSalesBy(orders, (d) => d.toISOString().slice(0, 7));
}
/**
 * Groups completed order revenue by calendar year (YYYY).
 */
function yearlySales(orders) {
    return groupSalesBy(orders, (d) => d.toISOString().slice(0, 4));
}
function groupSalesBy(orders, keyFn) {
    const result = {};
    for (const order of orders) {
        if (!COMPLETED(order))
            continue;
        const key = keyFn(new Date(order.orderDate));
        result[key] = (0, utils_1.round2)((result[key] ?? 0) + order.total);
    }
    return result;
}
function inRange(date, from, to) {
    if (from && date < from)
        return false;
    if (to && date > to)
        return false;
    return true;
}
//# sourceMappingURL=index.js.map