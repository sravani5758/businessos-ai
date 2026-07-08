/**
 * ORDERS SERVICE
 * This is the heart of the "brain" flow described in the assignment:
 *
 *   Customer buys products
 *     -> Inventory decreases   (inventoryService.decreaseStock)
 *     -> Revenue increases     (order.total, read later by analytics)
 *     -> Invoice created       (generateInvoice)
 *     -> Analytics updated     (analytics module reads orders[])
 *     -> AI receives data      (ai module reads orders[]/analytics)
 *     -> Dashboard updates     (frontend, later)
 */

import { Order, OrderProductLine, Product } from "../models";
import { PaymentMethod } from "../constants";
import { generateId, round2 } from "../utils";
import { decreaseStock, increaseStock } from "./inventoryService";

export interface CreateOrderInput {
  customerId: string;
  paymentMethod: PaymentMethod;
  items: { productId: string; quantity: number }[];
}

export interface Invoice {
  invoiceId: string;
  orderId: string;
  customerId: string;
  issuedAt: string;
  lineItems: {
    productId: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  total: number;
  paymentMethod: PaymentMethod;
}

/**
 * Calculates the total for a set of order product lines.
 */
export function calculateOrderTotal(lines: OrderProductLine[]): number {
  const total = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  return round2(total);
}

/**
 * Creates a new order:
 *  1. Validates & decreases stock for each product (inventory decreases)
 *  2. Builds order line items priced at current sellingPrice (revenue increases)
 *  3. Pushes the order into the orders list
 *
 * Throws if any product is missing or under-stocked — in that case no
 * stock changes are committed for the failing product, but earlier
 * lines in the same call may already have decremented stock. Callers
 * that need full atomicity should validate stock availability for all
 * lines before calling createOrder.
 */
export function createOrder(
  orders: Order[],
  products: Product[],
  input: CreateOrderInput
): Order {
  if (!input.items.length) {
    throw new Error("Cannot create an order with no items");
  }

  const lines: OrderProductLine[] = input.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);

    // Inventory decreases
    decreaseStock(products, item.productId, item.quantity);

    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: product.sellingPrice,
    };
  });

  const order: Order = {
    id: generateId("ord"),
    customerId: input.customerId,
    products: lines,
    total: calculateOrderTotal(lines),
    paymentMethod: input.paymentMethod,
    status: "Completed",
    orderDate: new Date().toISOString(),
  };

  orders.push(order);
  return order;
}

/**
 * Cancels an order: marks it Cancelled and restores stock for its items.
 */
export function cancelOrder(orders: Order[], products: Product[], orderId: string): Order | null {
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;
  if (order.status === "Cancelled") return order;

  for (const line of order.products) {
    increaseStock(products, line.productId, line.quantity);
  }

  order.status = "Cancelled";
  return order;
}

/**
 * Generates a structured invoice for a completed order.
 */
export function generateInvoice(orders: Order[], orderId: string): Invoice {
  const order = orders.find((o) => o.id === orderId);
  if (!order) throw new Error(`Order not found: ${orderId}`);

  return {
    invoiceId: generateId("inv"),
    orderId: order.id,
    customerId: order.customerId,
    issuedAt: new Date().toISOString(),
    lineItems: order.products.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      lineTotal: round2(line.unitPrice * line.quantity),
    })),
    total: order.total,
    paymentMethod: order.paymentMethod,
  };
}
