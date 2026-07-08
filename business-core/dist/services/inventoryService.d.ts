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
export declare function addProduct(products: Product[], input: NewProductInput): Product;
/**
 * Updates an existing product by id with a partial patch.
 * Returns the updated product, or null if not found.
 */
export declare function updateProduct(products: Product[], productId: string, patch: Partial<Omit<Product, "id" | "businessId" | "createdAt">>): Product | null;
/**
 * Removes a product from the list. Returns true if a product was removed.
 */
export declare function deleteProduct(products: Product[], productId: string): boolean;
/**
 * Increases stock for a product (e.g. new purchase / stock-in).
 */
export declare function increaseStock(products: Product[], productId: string, quantity: number): Product | null;
/**
 * Decreases stock for a product (e.g. sale / stock-out).
 * Throws if there isn't enough stock, so callers (e.g. createOrder)
 * can safely assume stock integrity after a successful call.
 */
export declare function decreaseStock(products: Product[], productId: string, quantity: number): Product;
/**
 * Returns all products whose stock has fallen to or below their minimumStock.
 */
export declare function getLowStockProducts(products: Product[]): Product[];
/**
 * Calculates the total value of current inventory, valued at cost price.
 */
export declare function calculateInventoryValue(products: Product[]): number;
