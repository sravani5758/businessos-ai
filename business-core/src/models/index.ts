/**
 * MODELS
 * Core TypeScript interfaces representing BusinessOS entities.
 * No frontend / DB / framework code lives here — pure data shapes.
 */

import { Category, ExpenseCategory, PaymentMethod, OrderStatusType, Role } from "../constants";

export interface Business {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  industry: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  category: Category;
  barcode: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
  supplierId: string;
  createdAt: string; // ISO date
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  loyaltyPoints: number;
}

export interface AttendanceRecord {
  date: string; // ISO date
  status: "Present" | "Absent" | "Leave" | "HalfDay";
}

export interface Employee {
  id: string;
  businessId: string;
  name: string;
  role: Role;
  salary: number;
  joiningDate: string; // ISO date
  attendance: AttendanceRecord[];
}

export interface Supplier {
  id: string;
  businessId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface OrderProductLine {
  productId: string;
  quantity: number;
  unitPrice: number; // price at time of sale
}

export interface Order {
  id: string;
  customerId: string;
  products: OrderProductLine[];
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatusType;
  orderDate: string; // ISO date
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  expenseDate: string; // ISO date
}
