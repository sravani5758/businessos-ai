/**
 * CUSTOMER SERVICE
 * Handles customer records and customer-derived business value.
 */

import { Customer, Order } from "../models";
import { generateId, round2 } from "../utils";

export interface NewCustomerInput {
  businessId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export function addCustomer(customers: Customer[], input: NewCustomerInput): Customer {
  const customer: Customer = {
    id: generateId("cust"),
    loyaltyPoints: 0,
    ...input,
  };
  customers.push(customer);
  return customer;
}

export function updateCustomer(
  customers: Customer[],
  customerId: string,
  patch: Partial<Omit<Customer, "id" | "businessId">>
): Customer | null {
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return null;
  Object.assign(customer, patch);
  return customer;
}

export function deleteCustomer(customers: Customer[], customerId: string): boolean {
  const index = customers.findIndex((c) => c.id === customerId);
  if (index === -1) return false;
  customers.splice(index, 1);
  return true;
}

/**
 * Returns all (non-cancelled) orders belonging to a customer.
 */
export function getCustomerOrders(orders: Order[], customerId: string): Order[] {
  return orders.filter((o) => o.customerId === customerId);
}

/**
 * Calculates the lifetime value of a customer — total amount spent
 * across all completed orders.
 */
export function calculateCustomerValue(orders: Order[], customerId: string): number {
  const total = orders
    .filter((o) => o.customerId === customerId && o.status === "Completed")
    .reduce((sum, o) => sum + o.total, 0);
  return round2(total);
}
