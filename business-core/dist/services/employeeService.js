"use strict";
/**
 * EMPLOYEE SERVICE
 * Handles employee records, attendance, and payroll-related calculations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEmployee = addEmployee;
exports.markAttendance = markAttendance;
exports.calculateSalaryExpense = calculateSalaryExpense;
const utils_1 = require("../utils");
function addEmployee(employees, input) {
    const employee = {
        id: (0, utils_1.generateId)("emp"),
        attendance: [],
        ...input,
    };
    employees.push(employee);
    return employee;
}
/**
 * Marks (or overwrites) an attendance record for a given date.
 */
function markAttendance(employees, employeeId, date, status) {
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee)
        return null;
    const existing = employee.attendance.find((a) => a.date === date);
    if (existing) {
        existing.status = status;
    }
    else {
        employee.attendance.push({ date, status });
    }
    return employee;
}
/**
 * Calculates total salary expense across all employees for a given
 * month/year. Employees who joined after the month are excluded.
 * Full monthly salary is used (pro-rating by attendance can be layered
 * on later once payroll rules are defined).
 */
function calculateSalaryExpense(employees, month, year) {
    const total = employees
        .filter((e) => {
        const joined = new Date(e.joiningDate);
        return joined.getFullYear() < year || (joined.getFullYear() === year && joined.getMonth() <= month);
    })
        .reduce((sum, e) => sum + e.salary, 0);
    return (0, utils_1.round2)(total);
}
//# sourceMappingURL=employeeService.js.map