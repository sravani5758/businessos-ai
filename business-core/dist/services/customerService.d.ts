/**
 * CUSTOMER SERVICE
 * Handles customer records and customer-derived business value.
 */
import { Customer, Order } from "../models";
export interface NewCustomerInput {
    businessId: string;
    name: string;
    phone: string;
    email: string;
    address: string;
}
export declare function addCustomer(customers: Customer[], input: NewCustomerInput): Customer;
export declare function updateCustomer(customers: Customer[], customerId: string, patch: Partial<Omit<Customer, "id" | "businessId">>): Customer | null;
export declare function deleteCustomer(customers: Customer[], customerId: string): boolean;
/**
 * Returns all (non-cancelled) orders belonging to a customer.
 */
export declare function getCustomerOrders(orders: Order[], customerId: string): Order[];
/**
 * Calculates the lifetime value of a customer — total amount spent
 * across all completed orders.
 */
export declare function calculateCustomerValue(orders: Order[], customerId: string): number;
