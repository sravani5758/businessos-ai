/**
 * DEMO SCRIPT
 * Run with: npm run dev   (or: npx ts-node src/demo.ts)
 *
 * Walks through the exact flow described in the assignment:
 *   Customer buys products -> Inventory decreases -> Revenue increases
 *   -> Invoice created -> Analytics updated -> AI receives latest data
 */

import {
  sampleProducts,
  sampleCustomers,
  sampleEmployees,
  sampleOrders,
  sampleExpenses,
  createOrder,
  generateInvoice,
  calculateRevenue,
  generateSalesReport,
  generateInventoryReport,
  generateBusinessSummary,
  formatCurrency,
} from "./index";

function section(title: string) {
  console.log("\n" + "=".repeat(60));
  console.log(title);
  console.log("=".repeat(60));
}

// Work on copies so re-running the demo doesn't mutate the shipped sample data.
const products = sampleProducts.map((p) => ({ ...p }));
const orders = sampleOrders.map((o) => ({ ...o }));
const customers = sampleCustomers;
const employees = sampleEmployees;
const expenses = sampleExpenses;

section("1. STARTING STATE");
console.log(`Products: ${products.length}, Customers: ${customers.length}, Employees: ${employees.length}`);
console.log(`Existing orders (sample data): ${orders.length}`);
console.log(`Revenue from existing sample orders: ${formatCurrency(calculateRevenue(orders))}`);

section("2. CUSTOMER BUYS PRODUCTS (createOrder)");
const productToBuy = products.find((p) => p.stock > 5)!;
console.log(`Before purchase -> "${productToBuy.name}" stock: ${productToBuy.stock}`);

const newOrder = createOrder(orders, products, {
  customerId: customers[0].id,
  paymentMethod: "UPI",
  items: [{ productId: productToBuy.id, quantity: 2 }],
});

console.log(`Order created: ${newOrder.id}, total: ${formatCurrency(newOrder.total)}`);
console.log(`After purchase  -> "${productToBuy.name}" stock: ${productToBuy.stock} (inventory decreased ✅)`);

section("3. INVOICE CREATED");
const invoice = generateInvoice(orders, newOrder.id);
console.log(JSON.stringify(invoice, null, 2));

section("4. ANALYTICS UPDATED");
const salesReport = generateSalesReport(orders);
console.log(`Total revenue (incl. new order): ${formatCurrency(salesReport.totalRevenue)}`);
console.log(`Average order value: ${formatCurrency(salesReport.averageOrderValue)}`);
console.log("Top 3 selling products:", salesReport.topSellingProducts.slice(0, 3));

const inventoryReport = generateInventoryReport(products);
console.log(`Low stock products: ${inventoryReport.lowStockProducts.length}`);

section("5. AI RECEIVES LATEST DATA (business summary)");
const aiSummary = generateBusinessSummary(orders, products, expenses);
console.log(aiSummary);

section("DONE ✅ — createOrder -> Inventory -> Revenue -> Invoice -> Analytics -> AI all wired up");
