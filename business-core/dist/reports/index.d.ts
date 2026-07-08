/**
 * REPORTS MODULE
 * Builds structured, JSON-serializable reports on top of the
 * analytics + services layers. Reports are read-only snapshots.
 */
import { Customer, Employee, Expense, Order, Product } from "../models";
import { topSellingProducts, worstSellingProducts } from "../analytics";
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
export declare function generateSalesReport(orders: Order[]): SalesReport;
export interface InventoryReport {
    generatedAt: string;
    totalProducts: number;
    totalStockUnits: number;
    inventoryValueAtCost: number;
    inventoryValueAtSelling: number;
    lowStockProducts: Product[];
}
export declare function generateInventoryReport(products: Product[]): InventoryReport;
export interface ExpenseReport {
    generatedAt: string;
    totalExpenses: number;
    byCategory: Record<string, number>;
    count: number;
}
export declare function generateExpenseReport(expenses: Expense[]): ExpenseReport;
export interface EmployeeReport {
    generatedAt: string;
    totalEmployees: number;
    totalMonthlySalaryBudget: number;
    byRole: Record<string, number>;
}
export declare function generateEmployeeReport(employees: Employee[]): EmployeeReport;
export interface CustomerReport {
    generatedAt: string;
    totalCustomers: number;
    topCustomersByValue: {
        customerId: string;
        name: string;
        value: number;
        orderCount: number;
    }[];
}
export declare function generateCustomerReport(customers: Customer[], orders: Order[]): CustomerReport;
/**
 * Combines revenue, cogs-based profit, and expenses into one snapshot.
 * Handy for finance-oriented dashboards.
 */
export declare function generateFinanceSnapshot(orders: Order[], products: Product[], expenses: Expense[]): {
    generatedAt: string;
    revenue: number;
    profit: number;
    expenses: number;
};
