// One-off generator script (Node, plain JS) that produces the sample
// dataset .ts files under packages/business-core/src/data/.
// Not part of the shipped package — just used to author the sample data.

const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "packages/business-core/src/data");

// Deterministic PRNG so the dataset is reproducible.
let seed = 42;
function rand() {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
}
function randInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}
function pad(n, len = 3) {
  return String(n).padStart(len, "0");
}
function isoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const BUSINESS_ID = "biz_0001";

// ---------------------------------------------------------------------------
// SUPPLIERS
// ---------------------------------------------------------------------------
const supplierCompanyNames = [
  "Nova Traders", "Bluewave Distributors", "Sunrise Wholesale", "Metro Supply Co",
  "Everest Imports", "Prime Stockists", "Greenfield Goods", "Orbit Merchants",
  "Silverline Supplies", "Highland Trading", "Coastal Distributors", "Vertex Wholesalers",
  "Pinnacle Traders", "Urban Supply Hub", "Anchor Distribution",
];
const suppliers = supplierCompanyNames.map((name, i) => ({
  id: `sup_${pad(i + 1)}`,
  businessId: BUSINESS_ID,
  companyName: name,
  contactPerson: `${pick(["Raj", "Amit", "Sara", "Wei", "Maria", "John", "Priya", "Omar"])} ${pick(["Sharma", "Khan", "Lee", "Garcia", "Smith", "Patel", "Nguyen"])}`,
  phone: `+91${randInt(7000000000, 9999999999)}`,
  email: `contact${i + 1}@${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
}));

// ---------------------------------------------------------------------------
// PRODUCTS (100)
// ---------------------------------------------------------------------------
const categories = ["Grocery", "Electronics", "Clothing", "Beauty", "Stationery", "Home", "Toys", "Sports", "Footwear", "Furniture"];
const productNamesByCategory = {
  Grocery: ["Basmati Rice 5kg", "Sunflower Oil 1L", "Whole Wheat Flour 5kg", "Toor Dal 1kg", "Green Tea 100 Bags", "Coffee Powder 500g", "Sugar 1kg", "Salt 1kg", "Peanut Butter 400g", "Oats 1kg"],
  Electronics: ["Wireless Mouse", "USB-C Cable", "Bluetooth Speaker", "Power Bank 10000mAh", "LED Bulb 9W", "Extension Cord 4m", "Earphones", "Smartwatch Band", "Phone Charger 20W", "HDMI Cable 2m"],
  Clothing: ["Men's Cotton T-Shirt", "Women's Kurti", "Kids Hoodie", "Formal Shirt", "Denim Jeans", "Sports Track Pants", "Winter Jacket", "Cotton Saree", "Polo T-Shirt", "Nightwear Set"],
  Beauty: ["Face Wash 100ml", "Sunscreen SPF50", "Shampoo 200ml", "Body Lotion 250ml", "Lipstick", "Hair Oil 200ml", "Face Cream 50g", "Deodorant Spray", "Talcum Powder", "Hand Sanitizer 100ml"],
  Stationery: ["Notebook A4 200pg", "Ball Pen Pack of 10", "Sketch Pens Set", "Geometry Box", "Highlighter Set", "Sticky Notes Pack", "File Folder A4", "Whiteboard Marker", "Pencil Box", "Glue Stick"],
  Home: ["Non-stick Frying Pan", "Steel Water Bottle 1L", "Cotton Bedsheet Set", "LED Table Lamp", "Storage Box 20L", "Kitchen Towel Set", "Wall Clock", "Door Mat", "Curtain Set 2pc", "Cushion Cover Set"],
  Toys: ["Building Blocks Set", "Remote Control Car", "Puzzle 100pc", "Soft Teddy Bear", "Action Figure", "Board Game", "Toy Kitchen Set", "Rubik's Cube", "Kids Tricycle", "Water Gun"],
  Sports: ["Football Size 5", "Yoga Mat", "Badminton Racket Set", "Cricket Bat", "Skipping Rope", "Dumbbell 5kg", "Cycling Helmet", "Table Tennis Set", "Basketball", "Resistance Bands Set"],
  Footwear: ["Running Shoes", "Casual Sneakers", "Leather Sandals", "Formal Shoes", "Flip Flops", "Sports Sandals", "Kids School Shoes", "Loafers", "Canvas Shoes", "Ankle Boots"],
  Furniture: ["Plastic Chair", "Study Table", "Bookshelf 5-Tier", "Foldable Bed", "Shoe Rack", "TV Stand", "Office Chair", "Dining Table 4-Seater", "Wardrobe 3-Door", "Bean Bag"],
};

const products = [];
let productCount = 0;
for (const category of categories) {
  const names = productNamesByCategory[category];
  for (const name of names) {
    productCount += 1;
    const costPrice = randInt(50, 3000);
    const margin = randInt(15, 60); // % margin
    const sellingPrice = Math.round(costPrice * (1 + margin / 100));
    products.push({
      id: `prod_${pad(productCount)}`,
      businessId: BUSINESS_ID,
      name,
      category,
      barcode: `89${randInt(1000000000, 9999999999)}`,
      costPrice,
      sellingPrice,
      stock: randInt(0, 200),
      minimumStock: randInt(5, 20),
      supplierId: pick(suppliers).id,
      createdAt: isoDaysAgo(randInt(30, 400)),
    });
  }
}
// productCount should be exactly 100 (10 categories x 10 names)

// ---------------------------------------------------------------------------
// CUSTOMERS (50)
// ---------------------------------------------------------------------------
const firstNames = ["Aarav", "Vivaan", "Aditya", "Ananya", "Diya", "Ishaan", "Kabir", "Meera", "Nisha", "Om", "Priya", "Rohan", "Saanvi", "Tara", "Vikram", "Zara", "Aisha", "Dev", "Kiran", "Neha", "Arjun", "Riya", "Sahil", "Pooja", "Karan"];
const lastNames = ["Sharma", "Verma", "Gupta", "Iyer", "Reddy", "Nair", "Menon", "Chopra", "Malhotra", "Kapoor", "Joshi", "Desai", "Rao", "Bose", "Pillai"];
const customers = [];
for (let i = 1; i <= 50; i++) {
  const first = pick(firstNames);
  const last = pick(lastNames);
  customers.push({
    id: `cust_${pad(i)}`,
    businessId: BUSINESS_ID,
    name: `${first} ${last}`,
    phone: `+91${randInt(7000000000, 9999999999)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
    address: `${randInt(1, 200)} ${pick(["MG Road", "Park Street", "Church Street", "Main Bazaar", "Ring Road", "Station Road"])}, ${pick(["Delhi", "Mumbai", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Kolkata"])}`,
    loyaltyPoints: randInt(0, 500),
  });
}

// ---------------------------------------------------------------------------
// EMPLOYEES (20)
// ---------------------------------------------------------------------------
const roles = ["Manager", "Cashier", "SalesStaff", "Accountant", "InventoryClerk", "Delivery", "Cleaner", "Security"];
const employees = [];
for (let i = 1; i <= 20; i++) {
  const joiningDate = isoDaysAgo(randInt(60, 1000));
  const attendance = [];
  for (let d = 0; d < 15; d++) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    attendance.push({
      date: date.toISOString().slice(0, 10),
      status: pick(["Present", "Present", "Present", "Present", "Absent", "Leave", "HalfDay"]),
    });
  }
  employees.push({
    id: `emp_${pad(i)}`,
    businessId: BUSINESS_ID,
    name: `${pick(firstNames)} ${pick(lastNames)}`,
    role: pick(roles),
    salary: randInt(15000, 60000),
    joiningDate,
    attendance,
  });
}

// ---------------------------------------------------------------------------
// ORDERS (500)
// ---------------------------------------------------------------------------
const paymentMethods = ["Cash", "Card", "UPI", "BankTransfer", "Wallet"];
const orderStatuses = ["Completed", "Completed", "Completed", "Completed", "Pending", "Cancelled", "Refunded"];
const orders = [];
for (let i = 1; i <= 500; i++) {
  const numItems = randInt(1, 5);
  const chosenProducts = new Set();
  while (chosenProducts.size < numItems) {
    chosenProducts.add(pick(products).id);
  }
  const lines = Array.from(chosenProducts).map((productId) => {
    const product = products.find((p) => p.id === productId);
    const quantity = randInt(1, 4);
    return { productId, quantity, unitPrice: product.sellingPrice };
  });
  const total = Math.round(lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0) * 100) / 100;

  orders.push({
    id: `ord_${pad(i, 4)}`,
    customerId: pick(customers).id,
    products: lines,
    total,
    paymentMethod: pick(paymentMethods),
    status: pick(orderStatuses),
    orderDate: isoDaysAgo(randInt(0, 365)),
  });
}

// ---------------------------------------------------------------------------
// EXPENSES (100)
// ---------------------------------------------------------------------------
const expenseCategories = ["Rent", "Salaries", "Utilities", "Marketing", "Supplies", "Maintenance", "Transport", "Miscellaneous"];
const expenseDescriptionsByCategory = {
  Rent: ["Monthly shop rent", "Warehouse rent"],
  Salaries: ["Staff salary disbursement", "Bonus payout"],
  Utilities: ["Electricity bill", "Water bill", "Internet bill"],
  Marketing: ["Social media ads", "Local newspaper ad", "Festive discount campaign"],
  Supplies: ["Packaging material", "Cleaning supplies", "Stationery for office"],
  Maintenance: ["AC servicing", "Equipment repair", "Store renovation"],
  Transport: ["Delivery fuel cost", "Courier charges", "Vehicle maintenance"],
  Miscellaneous: ["Bank charges", "Licensing fee", "Insurance premium"],
};
const expenses = [];
for (let i = 1; i <= 100; i++) {
  const category = pick(expenseCategories);
  expenses.push({
    id: `exp_${pad(i)}`,
    category,
    amount: randInt(200, 25000),
    description: pick(expenseDescriptionsByCategory[category]),
    expenseDate: isoDaysAgo(randInt(0, 365)),
  });
}

// ---------------------------------------------------------------------------
// WRITE FILES
// ---------------------------------------------------------------------------
function writeTsFile(filename, exportName, typeName, data) {
  const header = `/**\n * Auto-generated sample data. Safe to regenerate via generate_data.js.\n */\nimport { ${typeName} } from "../models";\n\nexport const ${exportName}: ${typeName}[] = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(path.join(OUT_DIR, filename), header);
  console.log(`Wrote ${filename} (${data.length} records)`);
}

writeTsFile("suppliers.ts", "sampleSuppliers", "Supplier", suppliers);
writeTsFile("products.ts", "sampleProducts", "Product", products);
writeTsFile("customers.ts", "sampleCustomers", "Customer", customers);
writeTsFile("employees.ts", "sampleEmployees", "Employee", employees);
writeTsFile("orders.ts", "sampleOrders", "Order", orders);
writeTsFile("expenses.ts", "sampleExpenses", "Expense", expenses);

// Sample business + data barrel
const sampleBusiness = {
  id: BUSINESS_ID,
  businessName: "Aarav General Store",
  ownerName: "Aarav Sharma",
  phone: "+919876543210",
  email: "owner@aaravstore.com",
  address: "12 MG Road, Bengaluru",
  industry: "Retail",
};
fs.writeFileSync(
  path.join(OUT_DIR, "business.ts"),
  `/**\n * Auto-generated sample business.\n */\nimport { Business } from "../models";\n\nexport const sampleBusiness: Business = ${JSON.stringify(sampleBusiness, null, 2)};\n`
);
console.log("Wrote business.ts");

fs.writeFileSync(
  path.join(OUT_DIR, "index.ts"),
  `export * from "./business";\nexport * from "./products";\nexport * from "./customers";\nexport * from "./employees";\nexport * from "./orders";\nexport * from "./expenses";\nexport * from "./suppliers";\n`
);
console.log("Wrote data/index.ts");
console.log(`\nTotals -> products: ${products.length}, customers: ${customers.length}, employees: ${employees.length}, orders: ${orders.length}, expenses: ${expenses.length}, suppliers: ${suppliers.length}`);
