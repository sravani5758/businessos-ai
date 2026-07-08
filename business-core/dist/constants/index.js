"use strict";
/**
 * CONSTANTS
 * Centralized enums/lookup values used across the BusinessOS Core Engine.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategories = exports.OrderStatus = exports.PaymentMethods = exports.Categories = exports.Roles = void 0;
exports.Roles = [
    "Manager",
    "Cashier",
    "SalesStaff",
    "Accountant",
    "InventoryClerk",
    "Delivery",
    "Cleaner",
    "Security",
];
exports.Categories = [
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
];
exports.PaymentMethods = ["Cash", "Card", "UPI", "BankTransfer", "Wallet"];
exports.OrderStatus = ["Pending", "Completed", "Cancelled", "Refunded"];
exports.ExpenseCategories = [
    "Rent",
    "Salaries",
    "Utilities",
    "Marketing",
    "Supplies",
    "Maintenance",
    "Transport",
    "Miscellaneous",
];
//# sourceMappingURL=index.js.map