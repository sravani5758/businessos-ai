/**
 * LIGHTWEIGHT TEST SUITE
 * Run with: npm test   (or: npx ts-node src/demo.test.ts)
 *
 * Uses Node's built-in `assert` module — no extra test framework needed,
 * keeping the package dependency-free as required by the assignment.
 * Exits with code 1 on failure so it works in CI too.
 */

import assert from "assert";
import {
  sampleProducts,
  sampleCustomers,
  sampleEmployees,
  sampleOrders,
  sampleExpenses,
  addProduct,
  decreaseStock,
  increaseStock,
  getLowStockProducts,
  calculateInventoryValue,
  addCustomer,
  calculateCustomerValue,
  addEmployee,
  markAttendance,
  calculateSalaryExpense,
  createOrder,
  cancelOrder,
  generateInvoice,
  calculateOrderTotal,
  addExpense,
  calculateMonthlyExpense,
  calculateRevenue,
  calculateInventoryWorth,
  topSellingProducts,
  generateSalesReport,
  generateInventoryReport,
  generateExpenseReport,
  generateEmployeeReport,
  generateCustomerReport,
  generateBusinessSummary,
  generateInventorySummary,
  formatCurrency,
  formatDate,
  calculatePercentage,
  calculateTax,
  calculateDiscount,
} from "./index";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${(err as Error).message}`);
    failed++;
  }
}

console.log("\n--- Sample data integrity ---");
test("has at least 100 products", () => assert.ok(sampleProducts.length >= 100));
test("has at least 50 customers", () => assert.ok(sampleCustomers.length >= 50));
test("has at least 20 employees", () => assert.ok(sampleEmployees.length >= 20));
test("has at least 500 orders", () => assert.ok(sampleOrders.length >= 500));
test("has at least 100 expenses", () => assert.ok(sampleExpenses.length >= 100));

console.log("\n--- Inventory service ---");
test("addProduct appends a product", () => {
  const products = sampleProducts.map((p) => ({ ...p }));
  const before = products.length;
  const product = addProduct(products, {
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
  assert.strictEqual(products.length, before + 1);
  assert.strictEqual(product.stock, 50);
});

test("decreaseStock reduces stock and throws on insufficient stock", () => {
  const products = sampleProducts.map((p) => ({ ...p }));
  const product = products[0];
  product.stock = 10;
  decreaseStock(products, product.id, 4);
  assert.strictEqual(product.stock, 6);
  assert.throws(() => decreaseStock(products, product.id, 100));
});

test("increaseStock adds stock back", () => {
  const products = sampleProducts.map((p) => ({ ...p }));
  const product = products[0];
  product.stock = 5;
  increaseStock(products, product.id, 10);
  assert.strictEqual(product.stock, 15);
});

test("getLowStockProducts only returns products at/under minimum", () => {
  const products = [
    { ...sampleProducts[0], stock: 2, minimumStock: 5 },
    { ...sampleProducts[1], stock: 50, minimumStock: 5 },
  ];
  const low = getLowStockProducts(products);
  assert.strictEqual(low.length, 1);
});

test("calculateInventoryValue = sum(costPrice * stock)", () => {
  const products = [
    { ...sampleProducts[0], costPrice: 10, stock: 5 },
    { ...sampleProducts[1], costPrice: 20, stock: 2 },
  ];
  assert.strictEqual(calculateInventoryValue(products), 90);
});

console.log("\n--- Customer service ---");
test("addCustomer starts with 0 loyalty points", () => {
  const customers = sampleCustomers.map((c) => ({ ...c }));
  const c = addCustomer(customers, {
    businessId: "biz_0001",
    name: "Test Customer",
    phone: "1234567890",
    email: "test@example.com",
    address: "Test Address",
  });
  assert.strictEqual(c.loyaltyPoints, 0);
});

test("calculateCustomerValue sums only completed orders", () => {
  const orders = [
    { ...sampleOrders[0], customerId: "cust_test", status: "Completed" as const, total: 100 },
    { ...sampleOrders[1], customerId: "cust_test", status: "Cancelled" as const, total: 500 },
  ];
  assert.strictEqual(calculateCustomerValue(orders, "cust_test"), 100);
});

console.log("\n--- Employee service ---");
test("addEmployee starts with empty attendance", () => {
  const employees = sampleEmployees.map((e) => ({ ...e }));
  const emp = addEmployee(employees, {
    businessId: "biz_0001",
    name: "Test Employee",
    role: "Cashier",
    salary: 20000,
    joiningDate: new Date().toISOString(),
  });
  assert.strictEqual(emp.attendance.length, 0);
});

test("markAttendance adds/updates a record", () => {
  const employees = sampleEmployees.map((e) => ({ ...e, attendance: [...e.attendance] }));
  const emp = employees[0];
  markAttendance(employees, emp.id, "2026-01-01", "Present");
  markAttendance(employees, emp.id, "2026-01-01", "Absent"); // overwrite same date
  const record = emp.attendance.find((a) => a.date === "2026-01-01");
  assert.strictEqual(record?.status, "Absent");
});

test("calculateSalaryExpense sums salaries for employees joined by that month", () => {
  const employees = [
    { ...sampleEmployees[0], salary: 1000, joiningDate: "2020-01-01" },
    { ...sampleEmployees[1], salary: 2000, joiningDate: "2099-01-01" }, // future hire, excluded
  ];
  const now = new Date();
  const total = calculateSalaryExpense(employees, now.getMonth(), now.getFullYear());
  assert.strictEqual(total, 1000);
});

console.log("\n--- Orders service (core flow) ---");
test("createOrder decreases stock and increases order total", () => {
  const products = sampleProducts.map((p) => ({ ...p, stock: 20 }));
  const orders: typeof sampleOrders = [];
  const product = products[0];

  const order = createOrder(orders, products, {
    customerId: sampleCustomers[0].id,
    paymentMethod: "Cash",
    items: [{ productId: product.id, quantity: 3 }],
  });

  assert.strictEqual(product.stock, 17);
  assert.strictEqual(order.total, product.sellingPrice * 3);
  assert.strictEqual(orders.length, 1);
});

test("createOrder throws when stock is insufficient", () => {
  const products = sampleProducts.map((p) => ({ ...p, stock: 1 }));
  const orders: typeof sampleOrders = [];
  assert.throws(() =>
    createOrder(orders, products, {
      customerId: sampleCustomers[0].id,
      paymentMethod: "Cash",
      items: [{ productId: products[0].id, quantity: 5 }],
    })
  );
});

test("cancelOrder restores stock and marks status Cancelled", () => {
  const products = sampleProducts.map((p) => ({ ...p, stock: 20 }));
  const orders: typeof sampleOrders = [];
  const order = createOrder(orders, products, {
    customerId: sampleCustomers[0].id,
    paymentMethod: "Cash",
    items: [{ productId: products[0].id, quantity: 3 }],
  });
  cancelOrder(orders, products, order.id);
  assert.strictEqual(products[0].stock, 20);
  assert.strictEqual(orders[0].status, "Cancelled");
});

test("generateInvoice returns matching totals", () => {
  const products = sampleProducts.map((p) => ({ ...p, stock: 20 }));
  const orders: typeof sampleOrders = [];
  const order = createOrder(orders, products, {
    customerId: sampleCustomers[0].id,
    paymentMethod: "Card",
    items: [{ productId: products[0].id, quantity: 2 }],
  });
  const invoice = generateInvoice(orders, order.id);
  assert.strictEqual(invoice.total, order.total);
  assert.strictEqual(invoice.lineItems.length, 1);
});

test("calculateOrderTotal sums unitPrice * quantity", () => {
  const total = calculateOrderTotal([
    { productId: "a", quantity: 2, unitPrice: 50 },
    { productId: "b", quantity: 1, unitPrice: 30 },
  ]);
  assert.strictEqual(total, 130);
});

console.log("\n--- Expense service ---");
test("addExpense appends an expense", () => {
  const expenses = sampleExpenses.map((e) => ({ ...e }));
  const before = expenses.length;
  addExpense(expenses, { category: "Rent", amount: 5000, description: "Test rent" });
  assert.strictEqual(expenses.length, before + 1);
});

test("calculateMonthlyExpense filters by month/year", () => {
  const now = new Date();
  const expenses = [
    { id: "e1", category: "Rent" as const, amount: 100, description: "x", expenseDate: now.toISOString() },
    { id: "e2", category: "Rent" as const, amount: 200, description: "y", expenseDate: "2000-01-01" },
  ];
  const total = calculateMonthlyExpense(expenses, now.getMonth(), now.getFullYear());
  assert.strictEqual(total, 100);
});

console.log("\n--- Analytics module ---");
test("calculateRevenue only counts completed orders", () => {
  const orders = [
    { ...sampleOrders[0], status: "Completed" as const, total: 100 },
    { ...sampleOrders[1], status: "Pending" as const, total: 999 },
  ];
  assert.strictEqual(calculateRevenue(orders), 100);
});

test("calculateInventoryWorth = sum(sellingPrice * stock)", () => {
  const products = [
    { ...sampleProducts[0], sellingPrice: 10, stock: 5 },
    { ...sampleProducts[1], sellingPrice: 20, stock: 2 },
  ];
  assert.strictEqual(calculateInventoryWorth(products), 90);
});

test("topSellingProducts ranks by units sold descending", () => {
  const orders = [
    { ...sampleOrders[0], status: "Completed" as const, products: [{ productId: "p1", quantity: 10, unitPrice: 5 }] },
    { ...sampleOrders[1], status: "Completed" as const, products: [{ productId: "p2", quantity: 2, unitPrice: 5 }] },
  ];
  const top = topSellingProducts(orders, 2);
  assert.strictEqual(top[0].productId, "p1");
});

console.log("\n--- Reports module ---");
test("generateSalesReport returns structured JSON with expected keys", () => {
  const report = generateSalesReport(sampleOrders);
  assert.ok("totalRevenue" in report);
  assert.ok("topSellingProducts" in report);
  assert.ok(Array.isArray(report.topSellingProducts));
});

test("generateInventoryReport returns expected keys", () => {
  const report = generateInventoryReport(sampleProducts);
  assert.ok("inventoryValueAtCost" in report);
  assert.ok(Array.isArray(report.lowStockProducts));
});

test("generateExpenseReport groups by category", () => {
  const report = generateExpenseReport(sampleExpenses);
  assert.ok(typeof report.byCategory === "object");
  assert.strictEqual(report.count, sampleExpenses.length);
});

test("generateEmployeeReport totals salary budget", () => {
  const report = generateEmployeeReport(sampleEmployees);
  assert.strictEqual(report.totalEmployees, sampleEmployees.length);
});

test("generateCustomerReport returns top 10 customers", () => {
  const report = generateCustomerReport(sampleCustomers, sampleOrders);
  assert.ok(report.topCustomersByValue.length <= 10);
});

console.log("\n--- AI module ---");
test("generateBusinessSummary returns summary + recommendations", () => {
  const result = generateBusinessSummary(sampleOrders, sampleProducts, sampleExpenses);
  assert.ok(typeof result.summary === "string");
  assert.ok(Array.isArray(result.recommendations));
  assert.ok(result.recommendations.length > 0);
});

test("generateInventorySummary flags low stock items", () => {
  const products = [{ ...sampleProducts[0], stock: 1, minimumStock: 10 }];
  const result = generateInventorySummary(products);
  assert.ok(result.recommendations.some((r) => r.toLowerCase().includes("reorder")));
});

console.log("\n--- Utilities ---");
test("formatCurrency formats a number as currency", () => {
  assert.ok(formatCurrency(1000).includes("1,000"));
});
test("formatDate formats an ISO date", () => {
  assert.strictEqual(formatDate("2026-01-15"), "15 Jan 2026");
});
test("calculatePercentage computes correct %", () => {
  assert.strictEqual(calculatePercentage(25, 100), 25);
});
test("calculateTax computes correct tax", () => {
  assert.strictEqual(calculateTax(100, 18), 18);
});
test("calculateDiscount computes correct discounted price", () => {
  assert.strictEqual(calculateDiscount(100, 10), 90);
});

console.log(`\n${"=".repeat(60)}`);
console.log(`RESULTS: ${passed} passed, ${failed} failed (${passed + failed} total)`);
console.log("=".repeat(60));

if (failed > 0) {
  process.exit(1);
}
