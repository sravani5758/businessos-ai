/**
 * CONSTANTS
 * Centralized enums/lookup values used across the BusinessOS Core Engine.
 */
export declare const Roles: readonly ["Manager", "Cashier", "SalesStaff", "Accountant", "InventoryClerk", "Delivery", "Cleaner", "Security"];
export type Role = (typeof Roles)[number];
export declare const Categories: readonly ["Grocery", "Electronics", "Clothing", "Beauty", "Stationery", "Home", "Toys", "Sports", "Footwear", "Furniture"];
export type Category = (typeof Categories)[number];
export declare const PaymentMethods: readonly ["Cash", "Card", "UPI", "BankTransfer", "Wallet"];
export type PaymentMethod = (typeof PaymentMethods)[number];
export declare const OrderStatus: readonly ["Pending", "Completed", "Cancelled", "Refunded"];
export type OrderStatusType = (typeof OrderStatus)[number];
export declare const ExpenseCategories: readonly ["Rent", "Salaries", "Utilities", "Marketing", "Supplies", "Maintenance", "Transport", "Miscellaneous"];
export type ExpenseCategory = (typeof ExpenseCategories)[number];
