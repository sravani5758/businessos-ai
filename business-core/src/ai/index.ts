/**
 * AI MODULE
 * These functions do NOT call any external AI provider (no Gemini yet).
 * They simply shape raw business data into the summary/recommendation
 * format that a future AI layer (or a real LLM call) will consume or
 * enrich. Think of this as "the prompt data", not "the prompt".
 */

import { Employee, Expense, Order, Product } from "../models";
import {
  calculateExpenses,
  calculateGrowth,
  calculateInventoryWorth,
  calculateProfit,
  calculateRevenue,
  topSellingProducts,
  worstSellingProducts,
} from "../analytics";
import { getLowStockProducts } from "../services/inventoryService";
import { calculateSalaryExpense } from "../services/employeeService";

export interface AISummary {
  summary: string;
  recommendations: string[];
}

function monthBounds(monthsAgo: number = 0) {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const to = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0, 23, 59, 59);
  return { from, to };
}

/**
 * High-level summary of overall business health.
 */
export function generateBusinessSummary(
  orders: Order[],
  products: Product[],
  expenses: Expense[]
): AISummary {
  const current = monthBounds(0);
  const previous = monthBounds(1);

  const revenue = calculateRevenue(orders, current.from, current.to);
  const growth = calculateGrowth(orders, previous, current);
  const profit = calculateProfit(orders, products, expenses, current.from, current.to);
  const lowStock = getLowStockProducts(products);

  const growthWord = growth >= 0 ? "increased" : "decreased";
  const summary = `Revenue ${growthWord} by ${Math.abs(growth)}% this month, reaching ${revenue}. Profit for the period stands at ${profit}.`;

  const recommendations: string[] = [];
  if (growth < 0) recommendations.push("Investigate the cause of declining revenue and consider a promotion.");
  if (lowStock.length > 0) recommendations.push(`Restock ${lowStock.length} product(s) running low on inventory.`);
  if (profit < 0) recommendations.push("Expenses currently exceed revenue — review cost centers.");
  if (recommendations.length === 0) recommendations.push("Business is performing steadily — maintain current strategy.");

  return { summary, recommendations };
}

/**
 * Summary focused on inventory health.
 */
export function generateInventorySummary(products: Product[]): AISummary {
  const lowStock = getLowStockProducts(products);
  const worth = calculateInventoryWorth(products);

  const summary = `Inventory currently holds ${products.length} product(s) worth ${worth} at selling price. ${lowStock.length} product(s) are at or below minimum stock.`;

  const recommendations: string[] =
    lowStock.length > 0
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
export function generateSalesSummary(orders: Order[]): AISummary {
  const revenue = calculateRevenue(orders);
  const top = topSellingProducts(orders, 3);
  const worst = worstSellingProducts(orders, 3);

  const summary = `Total sales revenue is ${revenue} across ${orders.length} order(s).`;

  const recommendations = [
    top.length ? `Promote top performers: ${top.map((p) => p.productId).join(", ")}.` : "No sales data yet to identify top products.",
    worst.length ? `Consider discounting or bundling slow movers: ${worst.map((p) => p.productId).join(", ")}.` : "",
  ].filter(Boolean) as string[];

  return { summary, recommendations };
}

/**
 * Summary focused on financial health (revenue vs expenses vs profit).
 */
export function generateFinanceSummary(orders: Order[], products: Product[], expenses: Expense[]): AISummary {
  const revenue = calculateRevenue(orders);
  const totalExpenses = calculateExpenses(expenses);
  const profit = calculateProfit(orders, products, expenses);

  const summary = `Revenue: ${revenue}, Expenses: ${totalExpenses}, Net Profit: ${profit}.`;

  const recommendations = [
    profit >= 0 ? "Profit margin is positive — consider reinvesting in growth." : "Profit is negative — review and cut non-essential expenses.",
    totalExpenses > revenue * 0.5 ? "Expenses are consuming a large share of revenue — audit major cost categories." : "",
  ].filter(Boolean) as string[];

  return { summary, recommendations };
}

/**
 * Summary focused on workforce/payroll.
 */
export function generateEmployeeSummary(employees: Employee[]): AISummary {
  const now = new Date();
  const salaryBudget = calculateSalaryExpense(employees, now.getMonth(), now.getFullYear());

  const summary = `Team of ${employees.length} employee(s) with a monthly salary budget of ${salaryBudget}.`;

  const recommendations = [
    employees.length === 0
      ? "No employees on record — add staff to enable payroll tracking."
      : "Review attendance trends monthly to spot chronic absenteeism early.",
  ];

  return { summary, recommendations };
}
