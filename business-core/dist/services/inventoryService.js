"use strict";
/**
 * INVENTORY SERVICE
 * Handles all product/stock related business logic.
 *
 * Design note: services operate on an in-memory array that is passed in
 * or held by the caller. This keeps the package storage-agnostic — later
 * the backend can swap the array for MongoDB queries without touching
 * this logic.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = addProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.increaseStock = increaseStock;
exports.decreaseStock = decreaseStock;
exports.getLowStockProducts = getLowStockProducts;
exports.calculateInventoryValue = calculateInventoryValue;
const utils_1 = require("../utils");
/**
 * Creates a new product and appends it to the given product list.
 * Returns the created product.
 */
function addProduct(products, input) {
    const product = {
        id: (0, utils_1.generateId)("prod"),
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
function updateProduct(products, productId, patch) {
    const product = products.find((p) => p.id === productId);
    if (!product)
        return null;
    Object.assign(product, patch);
    return product;
}
/**
 * Removes a product from the list. Returns true if a product was removed.
 */
function deleteProduct(products, productId) {
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1)
        return false;
    products.splice(index, 1);
    return true;
}
/**
 * Increases stock for a product (e.g. new purchase / stock-in).
 */
function increaseStock(products, productId, quantity) {
    const product = products.find((p) => p.id === productId);
    if (!product || quantity <= 0)
        return null;
    product.stock += quantity;
    return product;
}
/**
 * Decreases stock for a product (e.g. sale / stock-out).
 * Throws if there isn't enough stock, so callers (e.g. createOrder)
 * can safely assume stock integrity after a successful call.
 */
function decreaseStock(products, productId, quantity) {
    const product = products.find((p) => p.id === productId);
    if (!product)
        throw new Error(`Product not found: ${productId}`);
    if (quantity <= 0)
        throw new Error("Quantity must be positive");
    if (product.stock < quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${quantity}`);
    }
    product.stock -= quantity;
    return product;
}
/**
 * Returns all products whose stock has fallen to or below their minimumStock.
 */
function getLowStockProducts(products) {
    return products.filter((p) => p.stock <= p.minimumStock);
}
/**
 * Calculates the total value of current inventory, valued at cost price.
 */
function calculateInventoryValue(products) {
    const total = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0);
    return (0, utils_1.round2)(total);
}
//# sourceMappingURL=inventoryService.js.map