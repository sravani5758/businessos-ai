/**
 * REPORTS MODULE
 * Builds structured, JSON-serializable reports on top of the
 * analytics + services layers. Reports are read-only snapshots.
 */

import { Customer, Employee, Expense, Order, Product } from "../models";
import {
  calculateExpenses,
  calculateInventoryWorth,
  calculateProfit,
  calculateRevenue,
  dailySales,
  monthlySales,
  topSellingProducts,
  worstSellingProducts,
} from "../analytics";
import { getLowStockProducts, calculateInventoryValue } from "../services/inventoryService";
import { calculateCustomerValue, getCustomerOrders } from "../services/customerService";
import { round2 } from "../utils";

export interface SalesReport {
  generatedAt: string;
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  topSellingProducts: ReturnType<typeof topSellingProducts>;
  worstSellingProducts: ReturnType<typeof worstSellingProducts>;
  dailySales: Record<string, number>;
  monthlySales: Record<string, number>;
}

export function generateSalesReport(orders: Order[]): SalesReport {
  const completed = orders.filter((o) => o.status === "Completed");
  const cancelled = orders.filter((o) => o.status === "Cancelled");
  const totalRevenue = calculateRevenue(orders);

  return {
    generatedAt: new Date().toISOString(),
    totalRevenue,
    totalOrders: orders.length,
    completedOrders: completed.length,
    cancelledOrders: cancelled.length,
    averageOrderValue: completed.length ? round2(totalRevenue / completed.length) : 0,
    topSellingProducts: topSellingProducts(orders, 5),
    worstSellingProducts: worstSellingProducts(orders, 5),
    dailySales: dailySales(orders),
    monthlySales: monthlySales(orders),
  };
}

export interface InventoryReport {
  generatedAt: string;
  totalProducts: number;
  totalStockUnits: number;
  inventoryValueAtCost: number;
  inventoryValueAtSelling: number;
  lowStockProducts: Product[];
}

export function generateInventoryReport(products: Product[]): InventoryReport {
  return {
    generatedAt: new Date().toISOString(),
    totalProducts: products.length,
    totalStockUnits: products.reduce((sum, p) => sum + p.stock, 0),
    inventoryValueAtCost: calculateInventoryValue(products),
    inventoryValueAtSelling: calculateInventoryWorth(products),
    lowStockProducts: getLowStockProducts(products),
  };
}

export interface ExpenseReport {
  generatedAt: string;
  totalExpenses: number;
  byCategory: Record<string, number>;
  count: number;
}

export function generateExpenseReport(expenses: Expense[]): ExpenseReport {
  const byCategory: Record<string, number> = {};
  for (const e of expenses) {
    byCategory[e.category] = round2((byCategory[e.category] ?? 0) + e.amount);
  }
  return {
    generatedAt: new Date().toISOString(),
    totalExpenses: calculateExpenses(expenses),
    byCategory,
    count: expenses.length,
  };
}

export interface EmployeeReport {
  generatedAt: string;
  totalEmployees: number;
  totalMonthlySalaryBudget: number;
  byRole: Record<string, number>;
}

export function generateEmployeeReport(employees: Employee[]): EmployeeReport {
  const byRole: Record<string, number> = {};
  for (const e of employees) {
    byRole[e.role] = (byRole[e.role] ?? 0) + 1;
  }
  return {
    generatedAt: new Date().toISOString(),
    totalEmployees: employees.length,
    totalMonthlySalaryBudget: round2(employees.reduce((sum, e) => sum + e.salary, 0)),
    byRole,
  };
}

export interface CustomerReport {
  generatedAt: string;
  totalCustomers: number;
  topCustomersByValue: { customerId: string; name: string; value: number; orderCount: number }[];
}

export function generateCustomerReport(customers: Customer[], orders: Order[]): CustomerReport {
  const ranked = customers
    .map((c) => ({
      customerId: c.id,
      name: c.name,
      value: calculateCustomerValue(orders, c.id),
      orderCount: getCustomerOrders(orders, c.id).length,
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
export function generateFinanceSnapshot(orders: Order[], products: Product[], expenses: Expense[]) {
  return {
    generatedAt: new Date().toISOString(),
    revenue: calculateRevenue(orders),
    profit: calculateProfit(orders, products, expenses),
    expenses: calculateExpenses(expenses),
  };
}
