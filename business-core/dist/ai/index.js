"use strict";
/**
 * AI MODULE
 * These functions do NOT call any external AI provider (no Gemini yet).
 * They simply shape raw business data into the summary/recommendation
 * format that a future AI layer (or a real LLM call) will consume or
 * enrich. Think of this as "the prompt data", not "the prompt".
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBusinessSummary = generateBusinessSummary;
exports.generateInventorySummary = generateInventorySummary;
exports.generateSalesSummary = generateSalesSummary;
exports.generateFinanceSummary = generateFinanceSummary;
exports.generateEmployeeSummary = generateEmployeeSummary;
const analytics_1 = require("../analytics");
const inventoryService_1 = require("../services/inventoryService");
const employeeService_1 = require("../services/employeeService");
function monthBounds(monthsAgo = 0) {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const to = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0, 23, 59, 59);
    return { from, to };
}
/**
 * High-level summary of overall business health.
 */
function generateBusinessSummary(orders, products, expenses) {
    const current = monthBounds(0);
    const previous = monthBounds(1);
    const revenue = (0, analytics_1.calculateRevenue)(orders, current.from, current.to);
    const growth = (0, analytics_1.calculateGrowth)(orders, previous, current);
    const profit = (0, analytics_1.calculateProfit)(orders, products, expenses, current.from, current.to);
    const lowStock = (0, inventoryService_1.getLowStockProducts)(products);
    const growthWord = growth >= 0 ? "increased" : "decreased";
    const summary = `Revenue ${growthWord} by ${Math.abs(growth)}% this month, reaching ${revenue}. Profit for the period stands at ${profit}.`;
    const recommendations = [];
    if (growth < 0)
        recommendations.push("Investigate the cause of declining revenue and consider a promotion.");
    if (lowStock.length > 0)
        recommendations.push(`Restock ${lowStock.length} product(s) running low on inventory.`);
    if (profit < 0)
        recommendations.push("Expenses currently exceed revenue — review cost centers.");
    if (recommendations.length === 0)
        recommendations.push("Business is performing steadily — maintain current strategy.");
    return { summary, recommendations };
}
/**
 * Summary focused on inventory health.
 */
function generateInventorySummary(products) {
    const lowStock = (0, inventoryService_1.getLowStockProducts)(products);
    const worth = (0, analytics_1.calculateInventoryWorth)(products);
    const summary = `Inventory currently holds ${products.length} product(s) worth ${worth} at selling price. ${lowStock.length} product(s) are at or below minimum stock.`;
    const recommendations = lowStock.length > 0
        ? [
            `Reorder: ${lowStock.slice(0, 5).map((p) => p.name).join(", ")}${lowStock.length > 5 ? ", ..." : ""}.`,
            "Set up supplier reminders for recurring low-stock items.",
        ]
        : ["Stock levels are healthy across all products."];
    return { summary, recommendations };
}
/**
 * Summary focused on sales performance.
 */
function generateSalesSummary(orders) {
    const revenue = (0, analytics_1.calculateRevenue)(orders);
    const top = (0, analytics_1.topSellingProducts)(orders, 3);
    const worst = (0, analytics_1.worstSellingProducts)(orders, 3);
    const summary = `Total sales revenue is ${revenue} across ${orders.length} order(s).`;
    const recommendations = [
        top.length ? `Promote top performers: ${top.map((p) => p.productId).join(", ")}.` : "No sales data yet to identify top products.",
        worst.length ? `Consider discounting or bundling slow movers: ${worst.map((p) => p.productId).join(", ")}.` : "",
    ].filter(Boolean);
    return { summary, recommendations };
}
/**
 * Summary focused on financial health (revenue vs expenses vs profit).
 */
function generateFinanceSummary(orders, products, expenses) {
    const revenue = (0, analytics_1.calculateRevenue)(orders);
    const totalExpenses = (0, analytics_1.calculateExpenses)(expenses);
    const profit = (0, analytics_1.calculateProfit)(orders, products, expenses);
    const summary = `Revenue: ${revenue}, Expenses: ${totalExpenses}, Net Profit: ${profit}.`;
    const recommendations = [
        profit >= 0 ? "Profit margin is positive — consider reinvesting in growth." : "Profit is negative — review and cut non-essential expenses.",
        totalExpenses > revenue * 0.5 ? "Expenses are consuming a large share of revenue — audit major cost categories." : "",
    ].filter(Boolean);
    return { summary, recommendations };
}
/**
 * Summary focused on workforce/payroll.
 */
function generateEmployeeSummary(employees) {
    const now = new Date();
    const salaryBudget = (0, employeeService_1.calculateSalaryExpense)(employees, now.getMonth(), now.getFullYear());
    const summary = `Team of ${employees.length} employee(s) with a monthly salary budget of ${salaryBudget}.`;
    const recommendations = [
        employees.length === 0
            ? "No employees on record — add staff to enable payroll tracking."
            : "Review attendance trends monthly to spot chronic absenteeism early.",
    ];
    return { summary, recommendations };
}
//# sourceMappingURL=index.js.map