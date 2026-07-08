"use strict";
/**
 * LIGHTWEIGHT TEST SUITE
 * Run with: npm test   (or: npx ts-node src/demo.test.ts)
 *
 * Uses Node's built-in `assert` module — no extra test framework needed,
 * keeping the package dependency-free as required by the assignment.
 * Exits with code 1 on failure so it works in CI too.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const index_1 = require("./index");
let passed = 0;
let failed = 0;
function test(name, fn) {
    try {
        fn();
        console.log(`  ✅ ${name}`);
        passed++;
    }
    catch (err) {
        console.log(`  ❌ ${name}`);
        console.log(`     ${err.message}`);
        failed++;
    }
}
console.log("\n--- Sample data integrity ---");
test("has at least 100 products", () => assert_1.default.ok(index_1.sampleProducts.length >= 100));
test("has at least 50 customers", () => assert_1.default.ok(index_1.sampleCustomers.length >= 50));
test("has at least 20 employees", () => assert_1.default.ok(index_1.sampleEmployees.length >= 20));
test("has at least 500 orders", () => assert_1.default.ok(index_1.sampleOrders.length >= 500));
test("has at least 100 expenses", () => assert_1.default.ok(index_1.sampleExpenses.length >= 100));
console.log("\n--- Inventory service ---");
test("addProduct appends a product", () => {
    const products = index_1.sampleProducts.map((p) => ({ ...p }));
    const before = products.length;
    const product = (0, index_1.addProduct)(products, {
        businessId: "biz_0001",
        name: "Test Widget",
        category: "Electronics",
        barcode: "123456",
        costPrice: 10,
        sellingPrice: 20,
        stock: 50,
        minimumStock: 5,
        supplierId: "sup_01",
    });
    assert_1.default.strictEqual(products.length, before + 1);
    assert_1.default.strictEqual(product.stock, 50);
});
test("decreaseStock reduces stock and throws on insufficient stock", () => {
    const products = index_1.sampleProducts.map((p) => ({ ...p }));
    const product = products[0];
    product.stock = 10;
    (0, index_1.decreaseStock)(products, product.id, 4);
    assert_1.default.strictEqual(product.stock, 6);
    assert_1.default.throws(() => (0, index_1.decreaseStock)(products, product.id, 100));
});
test("increaseStock adds stock back", () => {
    const products = index_1.sampleProducts.map((p) => ({ ...p }));
    const product = products[0];
    product.stock = 5;
    (0, index_1.increaseStock)(products, product.id, 10);
    assert_1.default.strictEqual(product.stock, 15);
});
test("getLowStockProducts only returns products at/under minimum", () => {
    const products = [
        { ...index_1.sampleProducts[0], stock: 2, minimumStock: 5 },
        { ...index_1.sampleProducts[1], stock: 50, minimumStock: 5 },
    ];
    const low = (0, index_1.getLowStockProducts)(products);
    assert_1.default.strictEqual(low.length, 1);
});
test("calculateInventoryValue = sum(costPrice * stock)", () => {
    const products = [
        { ...index_1.sampleProducts[0], costPrice: 10, stock: 5 },
        { ...index_1.sampleProducts[1], costPrice: 20, stock: 2 },
    ];
    assert_1.default.strictEqual((0, index_1.calculateInventoryValue)(products), 90);
});
console.log("\n--- Customer service ---");
test("addCustomer starts with 0 loyalty points", () => {
    const customers = index_1.sampleCustomers.map((c) => ({ ...c }));
    const c = (0, index_1.addCustomer)(customers, {
        businessId: "biz_0001",
        name: "Test Customer",
        phone: "1234567890",
        email: "test@example.com",
        address: "Test Address",
    });
    assert_1.default.strictEqual(c.loyaltyPoints, 0);
});
test("calculateCustomerValue sums only completed orders", () => {
    const orders = [
        { ...index_1.sampleOrders[0], customerId: "cust_test", status: "Completed", total: 100 },
        { ...index_1.sampleOrders[1], customerId: "cust_test", status: "Cancelled", total: 500 },
    ];
    assert_1.default.strictEqual((0, index_1.calculateCustomerValue)(orders, "cust_test"), 100);
});
console.log("\n--- Employee service ---");
test("addEmployee starts with empty attendance", () => {
    const employees = index_1.sampleEmployees.map((e) => ({ ...e }));
    const emp = (0, index_1.addEmployee)(employees, {
        businessId: "biz_0001",
        name: "Test Employee",
        role: "Cashier",
        salary: 20000,
        joiningDate: new Date().toISOString(),
    });
    assert_1.default.strictEqual(emp.attendance.length, 0);
});
test("markAttendance adds/updates a record", () => {
    const employees = index_1.sampleEmployees.map((e) => ({ ...e, attendance: [...e.attendance] }));
    const emp = employees[0];
    (0, index_1.markAttendance)(employees, emp.id, "2026-01-01", "Present");
    (0, index_1.markAttendance)(employees, emp.id, "2026-01-01", "Absent"); // overwrite same date
    const record = emp.attendance.find((a) => a.date === "2026-01-01");
    assert_1.default.strictEqual(record?.status, "Absent");
});
test("calculateSalaryExpense sums salaries for employees joined by that month", () => {
    const employees = [
        { ...index_1.sampleEmployees[0], salary: 1000, joiningDate: "2020-01-01" },
        { ...index_1.sampleEmployees[1], salary: 2000, joiningDate: "2099-01-01" }, // future hire, excluded
    ];
    const now = new Date();
    const total = (0, index_1.calculateSalaryExpense)(employees, now.getMonth(), now.getFullYear());
    assert_1.default.strictEqual(total, 1000);
});
console.log("\n--- Orders service (core flow) ---");
test("createOrder decreases stock and increases order total", () => {
    const products = index_1.sampleProducts.map((p) => ({ ...p, stock: 20 }));
    const orders = [];
    const product = products[0];
    const order = (0, index_1.createOrder)(orders, products, {
        customerId: index_1.sampleCustomers[0].id,
        paymentMethod: "Cash",
        items: [{ productId: product.id, quantity: 3 }],
    });
    assert_1.default.strictEqual(product.stock, 17);
    assert_1.default.strictEqual(order.total, product.sellingPrice * 3);
    assert_1.default.strictEqual(orders.length, 1);
});
test("createOrder throws when stock is insufficient", () => {
    const products = index_1.sampleProducts.map((p) => ({ ...p, stock: 1 }));
    const orders = [];
    assert_1.default.throws(() => (0, index_1.createOrder)(orders, products, {
        customerId: index_1.sampleCustomers[0].id,
        paymentMethod: "Cash",
        items: [{ productId: products[0].id, quantity: 5 }],
    }));
});
test("cancelOrder restores stock and marks status Cancelled", () => {
    const products = index_1.sampleProducts.map((p) => ({ ...p, stock: 20 }));
    const orders = [];
    const order = (0, index_1.createOrder)(orders, products, {
        customerId: index_1.sampleCustomers[0].id,
        paymentMethod: "Cash",
        items: [{ productId: products[0].id, quantity: 3 }],
    });
    (0, index_1.cancelOrder)(orders, products, order.id);
    assert_1.default.strictEqual(products[0].stock, 20);
    assert_1.default.strictEqual(orders[0].status, "Cancelled");
});
test("generateInvoice returns matching totals", () => {
    const products = index_1.sampleProducts.map((p) => ({ ...p, stock: 20 }));
    const orders = [];
    const order = (0, index_1.createOrder)(orders, products, {
        customerId: index_1.sampleCustomers[0].id,
        paymentMethod: "Card",
        items: [{ productId: products[0].id, quantity: 2 }],
    });
    const invoice = (0, index_1.generateInvoice)(orders, order.id);
    assert_1.default.strictEqual(invoice.total, order.total);
    assert_1.default.strictEqual(invoice.lineItems.length, 1);
});
test("calculateOrderTotal sums unitPrice * quantity", () => {
    const total = (0, index_1.calculateOrderTotal)([
        { productId: "a", quantity: 2, unitPrice: 50 },
        { productId: "b", quantity: 1, unitPrice: 30 },
    ]);
    assert_1.default.strictEqual(total, 130);
});
console.log("\n--- Expense service ---");
test("addExpense appends an expense", () => {
    const expenses = index_1.sampleExpenses.map((e) => ({ ...e }));
    const before = expenses.length;
    (0, index_1.addExpense)(expenses, { category: "Rent", amount: 5000, description: "Test rent" });
    assert_1.default.strictEqual(expenses.length, before + 1);
});
test("calculateMonthlyExpense filters by month/year", () => {
    const now = new Date();
    const expenses = [
        { id: "e1", category: "Rent", amount: 100, description: "x", expenseDate: now.toISOString() },
        { id: "e2", category: "Rent", amount: 200, description: "y", expenseDate: "2000-01-01" },
    ];
    const total = (0, index_1.calculateMonthlyExpense)(expenses, now.getMonth(), now.getFullYear());
    assert_1.default.strictEqual(total, 100);
});
console.log("\n--- Analytics module ---");
test("calculateRevenue only counts completed orders", () => {
    const orders = [
        { ...index_1.sampleOrders[0], status: "Completed", total: 100 },
        { ...index_1.sampleOrders[1], status: "Pending", total: 999 },
    ];
    assert_1.default.strictEqual((0, index_1.calculateRevenue)(orders), 100);
});
test("calculateInventoryWorth = sum(sellingPrice * stock)", () => {
    const products = [
        { ...index_1.sampleProducts[0], sellingPrice: 10, stock: 5 },
        { ...index_1.sampleProducts[1], sellingPrice: 20, stock: 2 },
    ];
    assert_1.default.strictEqual((0, index_1.calculateInventoryWorth)(products), 90);
});
test("topSellingProducts ranks by units sold descending", () => {
    const orders = [
        { ...index_1.sampleOrders[0], status: "Completed", products: [{ productId: "p1", quantity: 10, unitPrice: 5 }] },
        { ...index_1.sampleOrders[1], status: "Completed", products: [{ productId: "p2", quantity: 2, unitPrice: 5 }] },
    ];
    const top = (0, index_1.topSellingProducts)(orders, 2);
    assert_1.default.strictEqual(top[0].productId, "p1");
});
console.log("\n--- Reports module ---");
test("generateSalesReport returns structured JSON with expected keys", () => {
    const report = (0, index_1.generateSalesReport)(index_1.sampleOrders);
    assert_1.default.ok("totalRevenue" in report);
    assert_1.default.ok("topSellingProducts" in report);
    assert_1.default.ok(Array.isArray(report.topSellingProducts));
});
test("generateInventoryReport returns expected keys", () => {
    const report = (0, index_1.generateInventoryReport)(index_1.sampleProducts);
    assert_1.default.ok("inventoryValueAtCost" in report);
    assert_1.default.ok(Array.isArray(report.lowStockProducts));
});
test("generateExpenseReport groups by category", () => {
    const report = (0, index_1.generateExpenseReport)(index_1.sampleExpenses);
    assert_1.default.ok(typeof report.byCategory === "object");
    assert_1.default.strictEqual(report.count, index_1.sampleExpenses.length);
});
test("generateEmployeeReport totals salary budget", () => {
    const report = (0, index_1.generateEmployeeReport)(index_1.sampleEmployees);
    assert_1.default.strictEqual(report.totalEmployees, index_1.sampleEmployees.length);
});
test("generateCustomerReport returns top 10 customers", () => {
    const report = (0, index_1.generateCustomerReport)(index_1.sampleCustomers, index_1.sampleOrders);
    assert_1.default.ok(report.topCustomersByValue.length <= 10);
});
console.log("\n--- AI module ---");
test("generateBusinessSummary returns summary + recommendations", () => {
    const result = (0, index_1.generateBusinessSummary)(index_1.sampleOrders, index_1.sampleProducts, index_1.sampleExpenses);
    assert_1.default.ok(typeof result.summary === "string");
    assert_1.default.ok(Array.isArray(result.recommendations));
    assert_1.default.ok(result.recommendations.length > 0);
});
test("generateInventorySummary flags low stock items", () => {
    const products = [{ ...index_1.sampleProducts[0], stock: 1, minimumStock: 10 }];
    const result = (0, index_1.generateInventorySummary)(products);
    assert_1.default.ok(result.recommendations.some((r) => r.toLowerCase().includes("reorder")));
});
console.log("\n--- Utilities ---");
test("formatCurrency formats a number as currency", () => {
    assert_1.default.ok((0, index_1.formatCurrency)(1000).includes("1,000"));
});
test("formatDate formats an ISO date", () => {
    assert_1.default.strictEqual((0, index_1.formatDate)("2026-01-15"), "15 Jan 2026");
});
test("calculatePercentage computes correct %", () => {
    assert_1.default.strictEqual((0, index_1.calculatePercentage)(25, 100), 25);
});
test("calculateTax computes correct tax", () => {
    assert_1.default.strictEqual((0, index_1.calculateTax)(100, 18), 18);
});
test("calculateDiscount computes correct discounted price", () => {
    assert_1.default.strictEqual((0, index_1.calculateDiscount)(100, 10), 90);
});
console.log(`\n${"=".repeat(60)}`);
console.log(`RESULTS: ${passed} passed, ${failed} failed (${passed + failed} total)`);
console.log("=".repeat(60));
if (failed > 0) {
    process.exit(1);
}
//# sourceMappingURL=demo.test.js.map