/**
 * EMPLOYEE SERVICE
 * Handles employee records, attendance, and payroll-related calculations.
 */
import { AttendanceRecord, Employee } from "../models";
export interface NewEmployeeInput {
    businessId: string;
    name: string;
    role: Employee["role"];
    salary: number;
    joiningDate: string;
}
export declare function addEmployee(employees: Employee[], input: NewEmployeeInput): Employee;
/**
 * Marks (or overwrites) an attendance record for a given date.
 */
export declare function markAttendance(employees: Employee[], employeeId: string, date: string, status: AttendanceRecord["status"]): Employee | null;
/**
 * Calculates total salary expense across all employees for a given
 * month/year. Employees who joined after the month are excluded.
 * Full monthly salary is used (pro-rating by attendance can be layered
 * on later once payroll rules are defined).
 */
export declare function calculateSalaryExpense(employees: Employee[], month: number, year: number): number;
