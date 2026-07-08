/**
 * INVENTORY SERVICE
 * Handles all product/stock related business logic.
 *
 * Design note: services operate on an in-memory array that is passed in
 * or held by the caller. This keeps the package storage-agnostic — later
 * the backend can swap the array for MongoDB queries without touching
 * this logic.
 */

import { Product } from "../models";
import { generateId, round2 } from "../utils";

export interface NewProductInput {
  businessId: string;
  name: string;
  category: Product["category"];
  barcode: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
  supplierId: string;
}

/**
 * Creates a new product and appends it to the given product list.
 * Returns the created product.
 */
export function addProduct(products: Product[], input: NewProductInput): Product {
  const product: Product = {
    id: generateId("prod"),
    createdAt: new Date().toISOString(),
    ...input,
  };
  products.push(product);
  return product;
}

/**
 * Updates an existing product by id with a partial patch.
 * Returns the updated product, or null if not found.
 */
export function updateProduct(
  products: Product[],
  productId: string,
  patch: Partial<Omit<Product, "id" | "businessId" | "createdAt">>
): Product | null {
  const product = products.find((p) => p.id === productId);
  if (!product) return null;
  Object.assign(product, patch);
  return product;
}

/**
 * Removes a product from the list. Returns true if a product was removed.
 */
export function deleteProduct(products: Product[], productId: string): boolean {
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

/**
 * Increases stock for a product (e.g. new purchase / stock-in).
 */
export function increaseStock(products: Product[], productId: string, quantity: number): Product | null {
  const product = products.find((p) => p.id === productId);
  if (!product || quantity <= 0) return null;
  product.stock += quantity;
  return product;
}

/**
 * Decreases stock for a product (e.g. sale / stock-out).
 * Throws if there isn't enough stock, so callers (e.g. createOrder)
 * can safely assume stock integrity after a successful call.
 */
export function decreaseStock(products: Product[], productId: string, quantity: number): Product {
  const product = products.find((p) => p.id === productId);
  if (!product) throw new Error(`Product not found: ${productId}`);
  if (quantity <= 0) throw new Error("Quantity must be positive");
  if (product.stock < quantity) {
    throw new Error(
      `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${quantity}`
    );
  }
  product.stock -= quantity;
  return product;
}

/**
 * Returns all products whose stock has fallen to or below their minimumStock.
 */
export function getLowStockProducts(products: Product[]): Product[] {
  return products.filter((p) => p.stock <= p.minimumStock);
}

/**
 * Calculates the total value of current inventory, valued at cost price.
 */
export function calculateInventoryValue(products: Product[]): number {
  const total = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0);
  return round2(total);
}
