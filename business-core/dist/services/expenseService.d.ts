/**
 * EXPENSE SERVICE
 * Handles business expense tracking.
 */
import { Expense } from "../models";
export interface NewExpenseInput {
    category: Expense["category"];
    amount: number;
    description: string;
    expenseDate?: string;
}
export declare function addExpense(expenses: Expense[], input: NewExpenseInput): Expense;
export declare function deleteExpense(expenses: Expense[], expenseId: string): boolean;
/**
 * Calculates total expenses for a given month/year.
 */
export declare function calculateMonthlyExpense(expenses: Expense[], month: number, year: number): number;
