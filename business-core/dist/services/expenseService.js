"use strict";
/**
 * EXPENSE SERVICE
 * Handles business expense tracking.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addExpense = addExpense;
exports.deleteExpense = deleteExpense;
exports.calculateMonthlyExpense = calculateMonthlyExpense;
const utils_1 = require("../utils");
function addExpense(expenses, input) {
    const expense = {
        id: (0, utils_1.generateId)("exp"),
        expenseDate: input.expenseDate ?? new Date().toISOString(),
        category: input.category,
        amount: input.amount,
        description: input.description,
    };
    expenses.push(expense);
    return expense;
}
function deleteExpense(expenses, expenseId) {
    const index = expenses.findIndex((e) => e.id === expenseId);
    if (index === -1)
        return false;
    expenses.splice(index, 1);
    return true;
}
/**
 * Calculates total expenses for a given month/year.
 */
function calculateMonthlyExpense(expenses, month, year) {
    const total = expenses
        .filter((e) => {
        const d = new Date(e.expenseDate);
        return d.getMonth() === month && d.getFullYear() === year;
    })
        .reduce((sum, e) => sum + e.amount, 0);
    return (0, utils_1.round2)(total);
}
//# sourceMappingURL=expenseService.js.map