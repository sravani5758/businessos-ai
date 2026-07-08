/**
 * CONSTANTS
 * Centralized enums/lookup values used across the BusinessOS Core Engine.
 */

export const Roles = [
  "Manager",
  "Cashier",
  "SalesStaff",
  "Accountant",
  "InventoryClerk",
  "Delivery",
  "Cleaner",
  "Security",
] as const;
export type Role = (typeof Roles)[number];

export const Categories = [
  "Grocery",
  "Electronics",
  "Clothing",
  "Beauty",
  "Stationery",
  "Home",
  "Toys",
  "Sports",
  "Footwear",
  "Furniture",
] as const;
export type Category = (typeof Categories)[number];

export const PaymentMethods = ["Cash", "Card", "UPI", "BankTransfer", "Wallet"] as const;
export type PaymentMethod = (typeof PaymentMethods)[number];

export const OrderStatus = ["Pending", "Completed", "Cancelled", "Refunded"] as const;
export type OrderStatusType = (typeof OrderStatus)[number];

export const ExpenseCategories = [
  "Rent",
  "Salaries",
  "Utilities",
  "Marketing",
  "Supplies",
  "Maintenance",
  "Transport",
  "Miscellaneous",
] as const;
export type ExpenseCategory = (typeof ExpenseCategories)[number];
