/**
 * ANALYTICS MODULE
 * Pure functions that derive business insight from raw data
 * (orders, products, expenses). No side effects, no storage.
 */

import { Expense, Order, Product } from "../models";
import { round2 } from "../utils";

const COMPLETED = (o: Order) => o.status === "Completed";

/**
 * Total revenue from completed orders, optionally within a date range.
 */
export function calculateRevenue(orders: Order[], from?: Date, to?: Date): number {
  const total = orders
    .filter(COMPLETED)
    .filter((o) => inRange(new Date(o.orderDate), from, to))
    .reduce((sum, o) => sum + o.total, 0);
  return round2(total);
}

/**
 * Total cost-of-goods-sold for completed orders — used to derive profit.
 */
function calculateCOGS(orders: Order[], products: Product[], from?: Date, to?: Date): number {
  const productMap = new Map(products.map((p) => [p.id, p]));
  let cogs = 0;
  for (const order of orders) {
    if (!COMPLETED(order) || !inRange(new Date(order.orderDate), from, to)) continue;
    for (const line of order.products) {
      const product = productMap.get(line.productId);
      if (product) cogs += product.costPrice * line.quantity;
    }
  }
  return cogs;
}

/**
 * Gross profit = revenue - cost of goods sold - operating expenses.
 */
export function calculateProfit(
  orders: Order[],
  products: Product[],
  expenses: Expense[],
  from?: Date,
  to?: Date
): number {
  const revenue = calculateRevenue(orders, from, to);
  const cogs = calculateCOGS(orders, products, from, to);
  const opex = calculateExpenses(expenses, from, to);
  return round2(revenue - cogs - opex);
}

/**
 * Total expenses, optionally within a date range.
 */
export function calculateExpenses(expenses: Expense[], from?: Date, to?: Date): number {
  const total = expenses
    .filter((e) => inRange(new Date(e.expenseDate), from, to))
    .reduce((sum, e) => sum + e.amount, 0);
  return round2(total);
}

/**
 * Calculates % growth in revenue between two periods.
 * Positive = grew, negative = shrank.
 */
export function calculateGrowth(
  orders: Order[],
  previousPeriod: { from: Date; to: Date },
  currentPeriod: { from: Date; to: Date }
): number {
  const previous = calculateRevenue(orders, previousPeriod.from, previousPeriod.to);
  const current = calculateRevenue(orders, currentPeriod.from, currentPeriod.to);
  if (previous === 0) return current > 0 ? 100 : 0;
  return round2(((current - previous) / previous) * 100);
}

/**
 * Total worth of current inventory, valued at selling price
 * (contrast with inventoryService.calculateInventoryValue, which uses cost price).
 */
export function calculateInventoryWorth(products: Product[]): number {
  const total = products.reduce((sum, p) => sum + p.sellingPrice * p.stock, 0);
  return round2(total);
}

interface ProductSalesRank {
  productId: string;
  unitsSold: number;
  revenue: number;
}

function rankProductSales(orders: Order[]): ProductSalesRank[] {
  const map = new Map<string, ProductSalesRank>();
  for (const order of orders) {
    if (!COMPLETED(order)) continue;
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
export function topSellingProducts(orders: Order[], limit: number = 5): ProductSalesRank[] {
  return rankProductSales(orders)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, limit)
    .map((p) => ({ ...p, revenue: round2(p.revenue) }));
}

/**
 * Returns the bottom N worst-selling products by units sold.
 * Only considers products that have sold at least once.
 */
export function worstSellingProducts(orders: Order[], limit: number = 5): ProductSalesRank[] {
  return rankProductSales(orders)
    .sort((a, b) => a.unitsSold - b.unitsSold)
    .slice(0, limit)
    .map((p) => ({ ...p, revenue: round2(p.revenue) }));
}

/**
 * Groups completed order revenue by calendar day (YYYY-MM-DD).
 */
export function dailySales(orders: Order[]): Record<string, number> {
  return groupSalesBy(orders, (d) => d.toISOString().slice(0, 10));
}

/**
 * Groups completed order revenue by calendar month (YYYY-MM).
 */
export function monthlySales(orders: Order[]): Record<string, number> {
  return groupSalesBy(orders, (d) => d.toISOString().slice(0, 7));
}

/**
 * Groups completed order revenue by calendar year (YYYY).
 */
export function yearlySales(orders: Order[]): Record<string, number> {
  return groupSalesBy(orders, (d) => d.toISOString().slice(0, 4));
}

function groupSalesBy(orders: Order[], keyFn: (d: Date) => string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const order of orders) {
    if (!COMPLETED(order)) continue;
    const key = keyFn(new Date(order.orderDate));
    result[key] = round2((result[key] ?? 0) + order.total);
  }
  return result;
}

function inRange(date: Date, from?: Date, to?: Date): boolean {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}
