/**
 * ANALYTICS MODULE
 * Pure functions that derive business insight from raw data
 * (orders, products, expenses). No side effects, no storage.
 */
import { Expense, Order, Product } from "../models";
/**
 * Total revenue from completed orders, optionally within a date range.
 */
export declare function calculateRevenue(orders: Order[], from?: Date, to?: Date): number;
/**
 * Gross profit = revenue - cost of goods sold - operating expenses.
 */
export declare function calculateProfit(orders: Order[], products: Product[], expenses: Expense[], from?: Date, to?: Date): number;
/**
 * Total expenses, optionally within a date range.
 */
export declare function calculateExpenses(expenses: Expense[], from?: Date, to?: Date): number;
/**
 * Calculates % growth in revenue between two periods.
 * Positive = grew, negative = shrank.
 */
export declare function calculateGrowth(orders: Order[], previousPeriod: {
    from: Date;
    to: Date;
}, currentPeriod: {
    from: Date;
    to: Date;
}): number;
/**
 * Total worth of current inventory, valued at selling price
 * (contrast with inventoryService.calculateInventoryValue, which uses cost price).
 */
export declare function calculateInventoryWorth(products: Product[]): number;
interface ProductSalesRank {
    productId: string;
    unitsSold: number;
    revenue: number;
}
/**
 * Returns the top N best-selling products by units sold.
 */
export declare function topSellingProducts(orders: Order[], limit?: number): ProductSalesRank[];
/**
 * Returns the bottom N worst-selling products by units sold.
 * Only considers products that have sold at least once.
 */
export declare function worstSellingProducts(orders: Order[], limit?: number): ProductSalesRank[];
/**
 * Groups completed order revenue by calendar day (YYYY-MM-DD).
 */
export declare function dailySales(orders: Order[]): Record<string, number>;
/**
 * Groups completed order revenue by calendar month (YYYY-MM).
 */
export declare function monthlySales(orders: Order[]): Record<string, number>;
/**
 * Groups completed order revenue by calendar year (YYYY).
 */
export declare function yearlySales(orders: Order[]): Record<string, number>;
export {};
