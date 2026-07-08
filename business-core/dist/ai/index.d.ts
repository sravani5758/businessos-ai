/**
 * AI MODULE
 * These functions do NOT call any external AI provider (no Gemini yet).
 * They simply shape raw business data into the summary/recommendation
 * format that a future AI layer (or a real LLM call) will consume or
 * enrich. Think of this as "the prompt data", not "the prompt".
 */
import { Employee, Expense, Order, Product } from "../models";
export interface AISummary {
    summary: string;
    recommendations: string[];
}
/**
 * High-level summary of overall business health.
 */
export declare function generateBusinessSummary(orders: Order[], products: Product[], expenses: Expense[]): AISummary;
/**
 * Summary focused on inventory health.
 */
export declare function generateInventorySummary(products: Product[]): AISummary;
/**
 * Summary focused on sales performance.
 */
export declare function generateSalesSummary(orders: Order[]): AISummary;
/**
 * Summary focused on financial health (revenue vs expenses vs profit).
 */
export declare function generateFinanceSummary(orders: Order[], products: Product[], expenses: Expense[]): AISummary;
/**
 * Summary focused on workforce/payroll.
 */
export declare function generateEmployeeSummary(employees: Employee[]): AISummary;
