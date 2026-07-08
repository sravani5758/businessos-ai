"use strict";
/**
 * REPORTS MODULE
 * Builds structured, JSON-serializable reports on top of the
 * analytics + services layers. Reports are read-only snapshots.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSalesReport = generateSalesReport;
exports.generateInventoryReport = generateInventoryReport;
exports.generateExpenseReport = generateExpenseReport;
exports.generateEmployeeReport = generateEmployeeReport;
exports.generateCustomerReport = generateCustomerReport;
exports.generateFinanceSnapshot = generateFinanceSnapshot;
const analytics_1 = require("../analytics");
const inventoryService_1 = require("../services/inventoryService");
const customerService_1 = require("../services/customerService");
const utils_1 = require("../utils");
function generateSalesReport(orders) {
    const completed = orders.filter((o) => o.status === "Completed");
    const cancelled = orders.filter((o) => o.status === "Cancelled");
    const totalRevenue = (0, analytics_1.calculateRevenue)(orders);
    return {
        generatedAt: new Date().toISOString(),
        totalRevenue,
        totalOrders: orders.length,
        completedOrders: completed.length,
        cancelledOrders: cancelled.length,
        averageOrderValue: completed.length ? (0, utils_1.round2)(totalRevenue / completed.length) : 0,
        topSellingProducts: (0, analytics_1.topSellingProducts)(orders, 5),
        worstSellingProducts: (0, analytics_1.worstSellingProducts)(orders, 5),
        dailySales: (0, analytics_1.dailySales)(orders),
        monthlySales: (0, analytics_1.monthlySales)(orders),
    };
}
function generateInventoryReport(products) {
    return {
        generatedAt: new Date().toISOString(),
        totalProducts: products.length,
        totalStockUnits: products.reduce((sum, p) => sum + p.stock, 0),
        inventoryValueAtCost: (0, inventoryService_1.calculateInventoryValue)(products),
        inventoryValueAtSelling: (0, analytics_1.calculateInventoryWorth)(products),
        lowStockProducts: (0, inventoryService_1.getLowStockProducts)(products),
    };
}
function generateExpenseReport(expenses) {
    const byCategory = {};
    for (const e of expenses) {
        byCategory[e.category] = (0, utils_1.round2)((byCategory[e.category] ?? 0) + e.amount);
    }
    return {
        generatedAt: new Date().toISOString(),
        totalExpenses: (0, analytics_1.calculateExpenses)(expenses),
        byCategory,
        count: expenses.length,
    };
}
function generateEmployeeReport(employees) {
    const byRole = {};
    for (const e of employees) {
        byRole[e.role] = (byRole[e.role] ?? 0) + 1;
    }
    return {
        generatedAt: new Date().toISOString(),
        totalEmployees: employees.length,
        totalMonthlySalaryBudget: (0, utils_1.round2)(employees.reduce((sum, e) => sum + e.salary, 0)),
        byRole,
    };
}
function generateCustomerReport(customers, orders) {
    const ranked = customers
        .map((c) => ({
        customerId: c.id,
        name: c.name,
        value: (0, customerService_1.calculateCustomerValue)(orders, c.id),
        orderCount: (0, customerService_1.getCustomerOrders)(orders, c.id).length,
    }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    return {
        generatedAt: new Date().toISOString(),
        totalCustomers: customers.length,
        topCustomersByValue: ranked,
    };
}
/**
 * Combines revenue, cogs-based profit, and expenses into one snapshot.
 * Handy for finance-oriented dashboards.
 */
function generateFinanceSnapshot(orders, products, expenses) {
    return {
        generatedAt: new Date().toISOString(),
        revenue: (0, analytics_1.calculateRevenue)(orders),
        profit: (0, analytics_1.calculateProfit)(orders, products, expenses),
        expenses: (0, analytics_1.calculateExpenses)(expenses),
    };
}
//# sourceMappingURL=index.js.map