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
export interface CreateOrderInput {
    customerId: string;
    paymentMethod: PaymentMethod;
    items: {
        productId: string;
        quantity: number;
    }[];
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
export declare function calculateOrderTotal(lines: OrderProductLine[]): number;
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
export declare function createOrder(orders: Order[], products: Product[], input: CreateOrderInput): Order;
/**
 * Cancels an order: marks it Cancelled and restores stock for its items.
 */
export declare function cancelOrder(orders: Order[], products: Product[], orderId: string): Order | null;
/**
 * Generates a structured invoice for a completed order.
 */
export declare function generateInvoice(orders: Order[], orderId: string): Invoice;
