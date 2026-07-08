/**
 * EMPLOYEE SERVICE
 * Handles employee records, attendance, and payroll-related calculations.
 */

import { AttendanceRecord, Employee } from "../models";
import { generateId, round2 } from "../utils";

export interface NewEmployeeInput {
  businessId: string;
  name: string;
  role: Employee["role"];
  salary: number;
  joiningDate: string;
}

export function addEmployee(employees: Employee[], input: NewEmployeeInput): Employee {
  const employee: Employee = {
    id: generateId("emp"),
    attendance: [],
    ...input,
  };
  employees.push(employee);
  return employee;
}

/**
 * Marks (or overwrites) an attendance record for a given date.
 */
export function markAttendance(
  employees: Employee[],
  employeeId: string,
  date: string,
  status: AttendanceRecord["status"]
): Employee | null {
  const employee = employees.find((e) => e.id === employeeId);
  if (!employee) return null;

  const existing = employee.attendance.find((a) => a.date === date);
  if (existing) {
    existing.status = status;
  } else {
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
export function calculateSalaryExpense(employees: Employee[], month: number, year: number): number {
  const total = employees
    .filter((e) => {
      const joined = new Date(e.joiningDate);
      return joined.getFullYear() < year || (joined.getFullYear() === year && joined.getMonth() <= month);
    })
    .reduce((sum, e) => sum + e.salary, 0);
  return round2(total);
}
