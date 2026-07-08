"use strict";
/**
 * CUSTOMER SERVICE
 * Handles customer records and customer-derived business value.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCustomer = addCustomer;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;
exports.getCustomerOrders = getCustomerOrders;
exports.calculateCustomerValue = calculateCustomerValue;
const utils_1 = require("../utils");
function addCustomer(customers, input) {
    const customer = {
        id: (0, utils_1.generateId)("cust"),
        loyaltyPoints: 0,
        ...input,
    };
    customers.push(customer);
    return customer;
}
function updateCustomer(customers, customerId, patch) {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer)
        return null;
    Object.assign(customer, patch);
    return customer;
}
function deleteCustomer(customers, customerId) {
    const index = customers.findIndex((c) => c.id === customerId);
    if (index === -1)
        return false;
    customers.splice(index, 1);
    return true;
}
/**
 * Returns all (non-cancelled) orders belonging to a customer.
 */
function getCustomerOrders(orders, customerId) {
    return orders.filter((o) => o.customerId === customerId);
}
/**
 * Calculates the lifetime value of a customer — total amount spent
 * across all completed orders.
 */
function calculateCustomerValue(orders, customerId) {
    const total = orders
        .filter((o) => o.customerId === customerId && o.status === "Completed")
        .reduce((sum, o) => sum + o.total, 0);
    return (0, utils_1.round2)(total);
}
//# sourceMappingURL=customerService.js.map