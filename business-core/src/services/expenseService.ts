/**
 * EXPENSE SERVICE
 * Handles business expense tracking.
 */

import { Expense } from "../models";
import { generateId, round2 } from "../utils";

export interface NewExpenseInput {
  category: Expense["category"];
  amount: number;
  description: string;
  expenseDate?: string;
}

export function addExpense(expenses: Expense[], input: NewExpenseInput): Expense {
  const expense: Expense = {
    id: generateId("exp"),
    expenseDate: input.expenseDate ?? new Date().toISOString(),
    category: input.category,
    amount: input.amount,
    description: input.description,
  };
  expenses.push(expense);
  return expense;
}

export function deleteExpense(expenses: Expense[], expenseId: string): boolean {
  const index = expenses.findIndex((e) => e.id === expenseId);
  if (index === -1) return false;
  expenses.splice(index, 1);
  return true;
}

/**
 * Calculates total expenses for a given month/year.
 */
export function calculateMonthlyExpense(expenses: Expense[], month: number, year: number): number {
  const total = expenses
    .filter((e) => {
      const d = new Date(e.expenseDate);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((sum, e) => sum + e.amount, 0);
  return round2(total);
}
