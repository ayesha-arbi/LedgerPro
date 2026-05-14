/* =============================================
   LEDGERPRO — FABRIC BUSINESS ACCOUNTING
   script.js
   ============================================= */
"use strict";

// ============================================
// PASSWORD / AUTH
// ============================================
const CORRECT_PASSWORD = "zahid";

function doLogin() {
  const input = document.getElementById("loginPassword");
  const error = document.getElementById("loginError");
  const val   = input.value;

  if (val === CORRECT_PASSWORD) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("appShell").style.display = "flex";
    error.classList.remove("visible");
    init();
  } else {
    error.classList.add("visible");
    input.classList.add("shake");
    input.value = "";
    setTimeout(() => input.classList.remove("shake"), 400);
    input.focus();
  }
}

function doLogout() {
  if (!confirm("Log out of LedgerPro?")) return;
  document.getElementById("appShell").style.display = "none";
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("loginPassword").value = "";
  document.getElementById("loginError").classList.remove("visible");
}

function toggleLoginEye() {
  const input = document.getElementById("loginPassword");
  const btn   = document.getElementById("loginEyeBtn");
  if (input.type === "password") {
    input.type = "text";
    btn.textContent = "◉";
  } else {
    input.type = "password";
    btn.textContent = "◎";
  }
}

// ============================================
// SAMPLE DATA (Fabric Business)
// ============================================

let sales = [
  { id:1,  customer:"Al-Amin Traders",     fabric:"Cotton",    item:"Premium Cotton Shirting",  quality:"A Standard",  meters:500,  ppm:170, amount:85000,  date:"2025-10-05", status:"Paid" },
  { id:2,  customer:"Zeshan Enterprises",  fabric:"Polyester", item:"Polyester Suiting",         quality:"B Grade",     meters:250,  ppm:130, amount:32500,  date:"2025-10-12", status:"Unpaid" },
  { id:3,  customer:"Noor Textiles Ltd",   fabric:"Denim",     item:"Stretch Denim 12oz",        quality:"A+ Premium",  meters:300,  ppm:180, amount:54000,  date:"2025-10-18", status:"Paid" },
  { id:4,  customer:"Abbas & Co.",         fabric:"Linen",     item:"Natural Linen Blend",       quality:"A Standard",  meters:150,  ppm:125, amount:18750,  date:"2025-11-02", status:"Paid" },
  { id:5,  customer:"Raheel Brothers",     fabric:"Cotton",    item:"Cotton Fabric Bulk",        quality:"A Standard",  meters:1000, ppm:170, amount:170000, date:"2025-11-15", status:"Unpaid" },
  { id:6,  customer:"Gulf Textile Export", fabric:"Lawn",      item:"Export Lawn Premium",       quality:"A+ Premium",  meters:1500, ppm:163, amount:245000, date:"2025-12-01", status:"Paid" },
  { id:7,  customer:"City Fashion Hub",    fabric:"Silk",      item:"Pure Silk Blend",           quality:"A+ Premium",  meters:200,  ppm:305, amount:61000,  date:"2026-01-08", status:"Paid" },
  { id:8,  customer:"Prime Garments",      fabric:"Chiffon",   item:"Printed Chiffon",           quality:"A Standard",  meters:380,  ppm:125, amount:47500,  date:"2026-01-22", status:"Unpaid" },
];

let purchases = [
  { id:1,  supplier:"Karachi Wholesale Co.",  fabric:"Cotton",    item:"Raw Cotton Shirting",       quality:"A Standard",  meters:1000, ppm:62,  amount:62000,  date:"2025-10-03", status:"Paid" },
  { id:2,  supplier:"Sindh Textile Mills",    fabric:"Polyester", item:"Polyester Grey Cloth",       quality:"B Grade",     meters:700,  ppm:55,  amount:38500,  date:"2025-10-10", status:"Paid" },
  { id:3,  supplier:"Pakistan Dye Corp",      fabric:"Cotton",    item:"Dyed Cotton Fabric",         quality:"A Standard",  meters:580,  ppm:50,  amount:29000,  date:"2025-10-20", status:"Unpaid" },
  { id:4,  supplier:"Gulshan Fabric House",   fabric:"Denim",     item:"Raw Denim 14oz",             quality:"A+ Premium",  meters:400,  ppm:100, amount:40000,  date:"2025-11-05", status:"Paid" },
  { id:5,  supplier:"Metro Textiles Pvt.",    fabric:"Lawn",      item:"Lawn Base Cloth",            quality:"A Standard",  meters:2000, ppm:45,  amount:90000,  date:"2025-11-18", status:"Paid" },
  { id:6,  supplier:"Karachi Wholesale Co.",  fabric:"Cotton",    item:"Cotton Shirting Bulk",       quality:"A Standard",  meters:1600, ppm:55,  amount:88000,  date:"2025-12-05", status:"Unpaid" },
  { id:7,  supplier:"Silk Route Imports",     fabric:"Silk",      item:"Raw Silk Fabric",            quality:"A+ Premium",  meters:300,  ppm:170, amount:51000,  date:"2026-01-10", status:"Paid" },
  { id:8,  supplier:"Chiffon World",          fabric:"Chiffon",   item:"Plain Chiffon Rolls",        quality:"B Grade",     meters:800,  ppm:70,  amount:56000,  date:"2026-01-15", status:"Paid" },
];

let payments = [
  { id:1, payTo:"Karachi Wholesale Co.",  purpose:"Invoice #KW-0041 Settlement", amount:62000, date:"2025-10-08" },
  { id:2, payTo:"Sindh Textile Mills",    purpose:"Invoice #STM-112 Full Pay",   amount:38500, date:"2025-10-14" },
  { id:3, payTo:"Gulshan Fabric House",   purpose:"Denim Invoice #GF-78",        amount:40000, date:"2025-11-07" },
  { id:4, payTo:"KESC Utilities",         purpose:"October Electricity Bill",    amount:12400, date:"2025-11-01" },
  { id:5, payTo:"Factory Rent",           purpose:"November Rent",               amount:45000, date:"2025-11-01" },
  { id:6, payTo:"Silk Route Imports",     purpose:"Invoice #SRI-291",            amount:51000, date:"2026-01-13" },
  { id:7, payTo:"KESC Utilities",         purpose:"December Electricity",        amount:13800, date:"2025-12-03" },
  { id:8, payTo:"Factory Rent",           purpose:"December Rent",               amount:45000, date:"2025-12-01" },
  { id:9, payTo:"Chiffon World",          purpose:"Invoice #CW-015 Payment",     amount:56000, date:"2026-01-18" },
];

let receipts = [
  { id:1, from:"Al-Amin Traders",     purpose:"Invoice #S001 Full Payment",  amount:85000,  date:"2025-10-07" },
  { id:2, from:"Noor Textiles Ltd",   purpose:"Invoice #S003 Full Payment",  amount:54000,  date:"2025-10-20" },
  { id:3, from:"Abbas & Co.",         purpose:"Invoice #S004 Full Payment",  amount:18750,  date:"2025-11-04" },
  { id:4, from:"Gulf Textile Export", purpose:"Export Invoice #GTE-001",     amount:245000, date:"2025-12-04" },
  { id:5, from:"City Fashion Hub",    purpose:"Invoice #S007 Full Payment",  amount:61000,  date:"2026-01-10" },
  { id:6, from:"Zeshan Enterprises",  purpose:"Partial Payment on Account",  amount:15000,  date:"2025-11-20" },
];

let nextSaleId     = sales.length + 1;
let nextPurchaseId = purchases.length + 1;
let nextPaymentId  = payments.length + 1;
let nextReceiptId  = receipts.length + 1;

// ============================================
// UTILITIES
// ============================================
const fmt    = (n) => "Rs " + Number(n).toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtNum = (n) => Number(n).toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 1 });

function today() { return new Date().toISOString().split("T")[0]; }

function formatDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
}

function showToast(msg, type = "info") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show " + type;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { t.className = "toast"; }, 3200);
}

function statusBadge(s) {
  if (s === "Paid")    return `<span class="badge badge-paid">Paid</span>`;
  if (s === "Partial") return `<span class="badge badge-partial">Partial</span>`;
  return `<span class="badge badge-unpaid">Unpaid</span>`;
}

function qualityBadge(q) {
  const map = {
    "A+ Premium": "badge-q-aplus",
    "A Standard": "badge-q-a",
    "B Grade":    "badge-q-b",
    "C Export":   "badge-q-c",
    "Seconds":    "badge-q-seconds",
  };
  return `<span class="badge ${map[q] || "badge-q-a"}">${q}</span>`;
}

function typeBadge(type) {
  const map = { Sale:"badge-sale", Purchase:"badge-purchase", Receipt:"badge-receipt", Payment:"badge-payment" };
  return `<span class="badge ${map[type] || ""}">${type}</span>`;
}

function totalOf(arr, key = "amount") {
  return arr.reduce((s, x) => s + Number(x[key] || 0), 0);
}

// ============================================
// AUTO-CALC TOTAL AMOUNT
// ============================================
function calcSaleAmount() {
  const m = parseFloat(document.getElementById("saleMeters").value) || 0;
  const p = parseFloat(document.getElementById("salePricePerMeter").value) || 0;
  document.getElementById("saleAmount").value = m && p ? (m * p).toFixed(0) : "";
}

function calcPurchaseAmount() {
  const m = parseFloat(document.getElementById("purchaseMeters").value) || 0;
  const p = parseFloat(document.getElementById("purchasePricePerMeter").value) || 0;
  document.getElementById("purchaseAmount").value = m && p ? (m * p).toFixed(0) : "";
}

// ============================================
// NAVIGATION
// ============================================
const SECTIONS = ["dashboard","sales","purchases","payments","receipts","ledger","inventory","reports"];
const SECTION_LABELS = {
  dashboard:"Dashboard", sales:"Sales", purchases:"Purchases",
  payments:"Payments", receipts:"Receipts", ledger:"Ledger",
  inventory:"Inventory", reports:"Reports"
};

function switchSection(name) {
  SECTIONS.forEach(s => document.getElementById("section-"+s)?.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.section === name));
  document.getElementById("section-"+name)?.classList.add("active");
  document.getElementById("breadcrumbCurrent").textContent = SECTION_LABELS[name] || name;

  if (name === "dashboard")  renderDashboard();
  if (name === "sales")      renderSalesTable();
  if (name === "purchases")  renderPurchasesTable();
  if (name === "payments")   renderPaymentsTable();
  if (name === "receipts")   renderReceiptsTable();
  if (name === "ledger")     renderLedger();
  if (name === "inventory")  renderInventory();
  if (name === "reports")    renderReports();

  if (window.innerWidth < 700) closeSidebar();
}

// ============================================
// DASHBOARD
// ============================================
function renderDashboard() {
  const totalSales      = totalOf(sales);
  const totalPurchases  = totalOf(purchases);
  const totalReceipts   = totalOf(receipts);
  const totalPayments   = totalOf(payments);
  const netProfit       = totalSales - totalPurchases - totalPayments;
  const totalMetersSold = totalOf(sales, "meters");
  const totalMetersBought = totalOf(purchases, "meters");
  const profitPerMeter  = totalMetersSold ? (netProfit / totalMetersSold) : 0;

  const metrics = [
    { label:"Total Sales",       value: fmt(totalSales),     color:"blue",   icon:"↑", change: sales.length + " entries", cls:"" },
    { label:"Total Purchases",   value: fmt(totalPurchases), color:"yellow", icon:"↓", change: purchases.length + " entries", cls:"" },
    { label:"Total Receipts",    value: fmt(totalReceipts),  color:"green",  icon:"⊞", change: receipts.length + " entries", cls:"" },
    { label:"Total Payments",    value: fmt(totalPayments),  color:"red",    icon:"⊟", change: payments.length + " entries", cls:"" },
    { label:"Net Profit / Loss", value: fmt(netProfit),      color:"purple", icon:"◈", change: netProfit >= 0 ? "▲ Profitable" : "▼ Loss", cls: netProfit >= 0 ? "positive" : "negative" },
    { label:"Profit / Meter",    value: fmt(profitPerMeter), color:"teal",   icon:"◐", change: fmtNum(totalMetersSold) + "m sold total", cls: profitPerMeter >= 0 ? "positive" : "negative" },
  ];

  document.getElementById("metricGrid").innerHTML = metrics.map(m => `
    <div class="metric-card ${m.color}">
      <div class="metric-label">${m.label}</div>
      <div class="metric-value ${m.cls}">${m.value}</div>
      <div class="metric-change">${m.change}</div>
      <span class="metric-icon">${m.icon}</span>
    </div>
  `).join("");

  // Fabric Insight Bar
  const fabrics = [...new Set([...sales.map(s=>s.fabric), ...purchases.map(p=>p.fabric)].filter(Boolean))];
  const fibCards = fabrics.slice(0, 7).map(f => {
    const sold   = totalOf(sales.filter(s=>s.fabric===f), "meters");
    const bought = totalOf(purchases.filter(p=>p.fabric===f), "meters");
    const stock  = bought - sold;
    return `
      <div class="fib-card">
        <div class="fib-label">${f.toUpperCase()}</div>
        <div class="fib-value">${fmtNum(stock)}m</div>
        <div class="fib-sub">Sold: ${fmtNum(sold)}m</div>
      </div>
    `;
  }).join("");
  document.getElementById("fabricInsightBar").innerHTML = fibCards || `<div class="fib-card"><div class="fib-label">No fabric data yet</div></div>`;

  // Recent sales
  const sTbody = document.querySelector("#dashSalesTable tbody");
  const rSales = [...sales].reverse().slice(0, 5);
  sTbody.innerHTML = rSales.length ? rSales.map(s => `
    <tr>
      <td>${s.customer}</td>
      <td>${s.fabric || "—"}</td>
      <td class="meter-cell">${fmtNum(s.meters)}m</td>
      <td class="amount-cell">${fmt(s.amount)}</td>
      <td>${statusBadge(s.status)}</td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="5">No sales records</td></tr>`;

  // Recent purchases
  const pTbody = document.querySelector("#dashPurchasesTable tbody");
  const rPurch = [...purchases].reverse().slice(0, 5);
  pTbody.innerHTML = rPurch.length ? rPurch.map(p => `
    <tr>
      <td>${p.supplier}</td>
      <td>${p.fabric || "—"}</td>
      <td class="meter-cell">${fmtNum(p.meters)}m</td>
      <td class="amount-cell">${fmt(p.amount)}</td>
      <td>${statusBadge(p.status)}</td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="5">No purchase records</td></tr>`;
}

// ============================================
// SALES
// ============================================
function renderSalesTable() {
  const filter = document.getElementById("salesFabricFilter")?.value || "";
  const data   = filter ? sales.filter(s => s.fabric === filter) : sales;
  document.getElementById("salesCount").textContent = data.length + " entries";

  const tbody = document.querySelector("#salesTable tbody");
  if (!data.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="11">No sales records${filter ? " for " + filter : ""}. Add one above.</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map((s, i) => `
    <tr>
      <td>${i+1}</td>
      <td>${s.customer}</td>
      <td>${s.fabric || "—"}</td>
      <td>${s.item}</td>
      <td>${qualityBadge(s.quality)}</td>
      <td class="meter-cell">${fmtNum(s.meters)}m</td>
      <td class="rate-cell">${fmt(s.ppm)}/m</td>
      <td class="amount-cell">${fmt(s.amount)}</td>
      <td>${formatDate(s.date)}</td>
      <td>${statusBadge(s.status)}</td>
      <td><button class="btn-danger" onclick="deleteSale(${s.id})">DELETE</button></td>
    </tr>
  `).join("");
}

function addSale() {
  const customer = document.getElementById("saleCustomer").value.trim();
  const fabric   = document.getElementById("saleFabric").value;
  const item     = document.getElementById("saleItem").value.trim();
  const quality  = document.getElementById("saleQuality").value;
  const meters   = parseFloat(document.getElementById("saleMeters").value);
  const ppm      = parseFloat(document.getElementById("salePricePerMeter").value);
  const amount   = parseFloat(document.getElementById("saleAmount").value);
  const date     = document.getElementById("saleDate").value;
  const status   = document.getElementById("saleStatus").value;

  if (!customer || !fabric || !item || !meters || !ppm || !date) {
    showToast("Please fill all required fields.", "error"); return;
  }
  if (meters <= 0 || ppm <= 0) {
    showToast("Meters and price must be greater than zero.", "error"); return;
  }

  sales.push({ id: nextSaleId++, customer, fabric, item, quality, meters, ppm, amount: amount || meters * ppm, date, status });
  clearForm("sale");
  renderSalesTable();
  renderDashboard();
  showToast("Sale record added successfully.", "success");
}

function deleteSale(id) {
  if (!confirm("Delete this sale record?")) return;
  sales = sales.filter(s => s.id !== id);
  renderSalesTable();
  showToast("Sale deleted.", "info");
}

// ============================================
// PURCHASES
// ============================================
function renderPurchasesTable() {
  const filter = document.getElementById("purchasesFabricFilter")?.value || "";
  const data   = filter ? purchases.filter(p => p.fabric === filter) : purchases;
  document.getElementById("purchasesCount").textContent = data.length + " entries";

  const tbody = document.querySelector("#purchasesTable tbody");
  if (!data.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="11">No purchase records${filter ? " for " + filter : ""}. Add one above.</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map((p, i) => `
    <tr>
      <td>${i+1}</td>
      <td>${p.supplier}</td>
      <td>${p.fabric || "—"}</td>
      <td>${p.item}</td>
      <td>${qualityBadge(p.quality)}</td>
      <td class="meter-cell">${fmtNum(p.meters)}m</td>
      <td class="rate-cell">${fmt(p.ppm)}/m</td>
      <td class="amount-cell">${fmt(p.amount)}</td>
      <td>${formatDate(p.date)}</td>
      <td>${statusBadge(p.status)}</td>
      <td><button class="btn-danger" onclick="deletePurchase(${p.id})">DELETE</button></td>
    </tr>
  `).join("");
}

function addPurchase() {
  const supplier = document.getElementById("purchaseSupplier").value.trim();
  const fabric   = document.getElementById("purchaseFabric").value;
  const item     = document.getElementById("purchaseItem").value.trim();
  const quality  = document.getElementById("purchaseQuality").value;
  const meters   = parseFloat(document.getElementById("purchaseMeters").value);
  const ppm      = parseFloat(document.getElementById("purchasePricePerMeter").value);
  const amount   = parseFloat(document.getElementById("purchaseAmount").value);
  const date     = document.getElementById("purchaseDate").value;
  const status   = document.getElementById("purchaseStatus").value;

  if (!supplier || !fabric || !item || !meters || !ppm || !date) {
    showToast("Please fill all required fields.", "error"); return;
  }
  if (meters <= 0 || ppm <= 0) {
    showToast("Meters and price must be greater than zero.", "error"); return;
  }

  purchases.push({ id: nextPurchaseId++, supplier, fabric, item, quality, meters, ppm, amount: amount || meters * ppm, date, status });
  clearForm("purchase");
  renderPurchasesTable();
  renderDashboard();
  showToast("Purchase record added successfully.", "success");
}

function deletePurchase(id) {
  if (!confirm("Delete this purchase record?")) return;
  purchases = purchases.filter(p => p.id !== id);
  renderPurchasesTable();
  showToast("Purchase deleted.", "info");
}

// ============================================
// PAYMENTS
// ============================================
function renderPaymentsTable() {
  const tbody = document.querySelector("#paymentsTable tbody");
  document.getElementById("paymentsCount").textContent = payments.length + " entries";
  if (!payments.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No payment records yet.</td></tr>`; return;
  }
  tbody.innerHTML = payments.map((p,i) => `
    <tr>
      <td>${i+1}</td><td>${p.payTo}</td><td>${p.purpose}</td>
      <td class="amount-cell">${fmt(p.amount)}</td>
      <td>${formatDate(p.date)}</td>
      <td><button class="btn-danger" onclick="deletePayment(${p.id})">DELETE</button></td>
    </tr>
  `).join("");
}

function addPayment() {
  const payTo   = document.getElementById("paymentTo").value.trim();
  const amount  = parseFloat(document.getElementById("paymentAmount").value);
  const purpose = document.getElementById("paymentPurpose").value.trim();
  const date    = document.getElementById("paymentDate").value;
  if (!payTo || !amount || !purpose || !date) { showToast("All fields required.", "error"); return; }
  if (amount <= 0) { showToast("Amount must be > 0.", "error"); return; }
  payments.push({ id: nextPaymentId++, payTo, amount, purpose, date });
  clearForm("payment");
  renderPaymentsTable();
  showToast("Payment added.", "success");
}

function deletePayment(id) {
  if (!confirm("Delete this payment?")) return;
  payments = payments.filter(p => p.id !== id);
  renderPaymentsTable();
  showToast("Payment deleted.", "info");
}

// ============================================
// RECEIPTS
// ============================================
function renderReceiptsTable() {
  const tbody = document.querySelector("#receiptsTable tbody");
  document.getElementById("receiptsCount").textContent = receipts.length + " entries";
  if (!receipts.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No receipt records yet.</td></tr>`; return;
  }
  tbody.innerHTML = receipts.map((r,i) => `
    <tr>
      <td>${i+1}</td><td>${r.from}</td><td>${r.purpose}</td>
      <td class="amount-cell">${fmt(r.amount)}</td>
      <td>${formatDate(r.date)}</td>
      <td><button class="btn-danger" onclick="deleteReceipt(${r.id})">DELETE</button></td>
    </tr>
  `).join("");
}

function addReceipt() {
  const from    = document.getElementById("receiptFrom").value.trim();
  const amount  = parseFloat(document.getElementById("receiptAmount").value);
  const purpose = document.getElementById("receiptPurpose").value.trim();
  const date    = document.getElementById("receiptDate").value;
  if (!from || !amount || !purpose || !date) { showToast("All fields required.", "error"); return; }
  if (amount <= 0) { showToast("Amount must be > 0.", "error"); return; }
  receipts.push({ id: nextReceiptId++, from, amount, purpose, date });
  clearForm("receipt");
  renderReceiptsTable();
  showToast("Receipt added.", "success");
}

function deleteReceipt(id) {
  if (!confirm("Delete this receipt?")) return;
  receipts = receipts.filter(r => r.id !== id);
  renderReceiptsTable();
  showToast("Receipt deleted.", "info");
}

// ============================================
// LEDGER
// ============================================
function buildLedgerEntries() {
  const entries = [];
  sales.forEach(s     => entries.push({ date:s.date, name:s.customer,  description:"Sale: "+s.item, type:"Sale", debit:0, credit:s.amount }));
  purchases.forEach(p => entries.push({ date:p.date, name:p.supplier,  description:"Purchase: "+p.item, type:"Purchase", debit:p.amount, credit:0 }));
  payments.forEach(p  => entries.push({ date:p.date, name:p.payTo,     description:"Payment: "+p.purpose, type:"Payment", debit:p.amount, credit:0 }));
  receipts.forEach(r  => entries.push({ date:r.date, name:r.from,      description:"Receipt: "+r.purpose, type:"Receipt", debit:0, credit:r.amount }));
  entries.sort((a,b) => new Date(a.date) - new Date(b.date));
  return entries;
}

function renderLedger() {
  const entries = buildLedgerEntries();
  const tbody   = document.querySelector("#ledgerTable tbody");
  document.getElementById("ledgerCount").textContent = entries.length + " entries";

  let totalDebit=0, totalCredit=0, balance=0;
  if (!entries.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="8">No ledger entries available.</td></tr>`;
    document.getElementById("ledgerSummary").innerHTML = "";
    return;
  }

  tbody.innerHTML = entries.map((e, i) => {
    totalDebit  += e.debit;
    totalCredit += e.credit;
    balance     += (e.credit - e.debit);
    const cls    = balance >= 0 ? "col-credit" : "col-debit";
    return `
      <tr>
        <td>${i+1}</td>
        <td>${formatDate(e.date)}</td>
        <td>${e.name}</td>
        <td>${e.description}</td>
        <td>${typeBadge(e.type)}</td>
        <td class="amount-cell col-debit">${e.debit  ? fmt(e.debit)  : "—"}</td>
        <td class="amount-cell col-credit">${e.credit ? fmt(e.credit) : "—"}</td>
        <td class="amount-cell ${cls}">${fmt(balance)}</td>
      </tr>
    `;
  }).join("");

  const net = totalCredit - totalDebit;
  document.getElementById("ledgerSummary").innerHTML = `
    <div class="ledger-summary-card"><div class="ledger-summary-label">Total Debit</div><div class="ledger-summary-value col-debit">${fmt(totalDebit)}</div></div>
    <div class="ledger-summary-card"><div class="ledger-summary-label">Total Credit</div><div class="ledger-summary-value col-credit">${fmt(totalCredit)}</div></div>
    <div class="ledger-summary-card"><div class="ledger-summary-label">Net Balance</div><div class="ledger-summary-value ${net>=0?"col-credit":"col-debit"}">${fmt(net)}</div></div>
  `;
}

// ============================================
// INVENTORY
// ============================================
function renderInventory() {
  const allFabrics = [...new Set([...sales.map(s=>s.fabric), ...purchases.map(p=>p.fabric)].filter(Boolean))].sort();

  if (!allFabrics.length) {
    document.getElementById("inventoryGrid").innerHTML = `<div class="fib-card"><div class="fib-label">No inventory data yet.</div></div>`;
    document.querySelector("#inventoryTable tbody").innerHTML = `<tr class="empty-row"><td colspan="8">No data available.</td></tr>`;
    return;
  }

  const rows = allFabrics.map(fabric => {
    const sRows = sales.filter(s => s.fabric === fabric);
    const pRows = purchases.filter(p => p.fabric === fabric);
    const sold     = totalOf(sRows, "meters");
    const bought   = totalOf(pRows, "meters");
    const stock    = bought - sold;
    const sellAmt  = totalOf(sRows);
    const buyAmt   = totalOf(pRows);
    const buyAvg   = bought ? (buyAmt / bought) : 0;
    const sellAvg  = sold   ? (sellAmt / sold)  : 0;
    const margin   = sellAvg - buyAvg;
    const pct      = bought ? Math.min(100, Math.round((stock / bought) * 100)) : 0;
    const stockStatus = stock <= 0 ? "OUT OF STOCK" : pct < 20 ? "LOW STOCK" : "IN STOCK";
    const stockBadgeCls = stock <= 0 ? "badge-outstock" : pct < 20 ? "badge-lowstock" : "badge-instock";
    const barCls   = stock <= 0 ? "out" : pct < 20 ? "low" : "ok";
    return { fabric, sold, bought, stock, buyAvg, sellAvg, margin, pct, stockStatus, stockBadgeCls, barCls };
  });

  // Inventory cards
  document.getElementById("inventoryGrid").innerHTML = rows.map(r => `
    <div class="inv-card">
      <div class="inv-fabric-name">${r.fabric}</div>
      <div class="inv-stat"><span class="inv-stat-label">PURCHASED</span><span class="inv-stat-value">${fmtNum(r.bought)}m</span></div>
      <div class="inv-stat"><span class="inv-stat-label">SOLD</span><span class="inv-stat-value" style="color:var(--blue-bright)">${fmtNum(r.sold)}m</span></div>
      <div class="inv-stat"><span class="inv-stat-label">STOCK LEFT</span><span class="inv-stat-value" style="color:${r.stock<=0?"var(--red)":r.pct<20?"var(--yellow)":"var(--green)"}">${fmtNum(r.stock)}m</span></div>
      <div class="inv-bar-track"><div class="inv-bar-fill ${r.barCls}" style="width:${r.pct}%"></div></div>
    </div>
  `).join("");

  // Inventory table
  document.querySelector("#inventoryTable tbody").innerHTML = rows.map(r => `
    <tr>
      <td><strong>${r.fabric}</strong></td>
      <td class="meter-cell">${fmtNum(r.bought)}m</td>
      <td class="meter-cell">${fmtNum(r.sold)}m</td>
      <td class="meter-cell" style="color:${r.stock<=0?"var(--red)":r.pct<20?"var(--yellow)":"var(--green)"}"><strong>${fmtNum(r.stock)}m</strong></td>
      <td class="rate-cell">${fmt(r.buyAvg)}/m</td>
      <td class="rate-cell">${fmt(r.sellAvg)}/m</td>
      <td class="amount-cell" style="color:${r.margin>=0?"var(--green)":"var(--red)"}">${fmt(r.margin)}/m</td>
      <td><span class="badge ${r.stockBadgeCls}">${r.stockStatus}</span></td>
    </tr>
  `).join("");
}

// ============================================
// REPORTS
// ============================================
function renderReports() {
  const totalSales      = totalOf(sales);
  const totalPurchases  = totalOf(purchases);
  const totalReceipts   = totalOf(receipts);
  const totalPayments   = totalOf(payments);
  const grossProfit     = totalSales - totalPurchases;
  const netProfit       = grossProfit - totalPayments;
  const totalMetersSold = totalOf(sales, "meters");
  const profitPerMeter  = totalMetersSold ? (netProfit / totalMetersSold) : 0;
  const paidSales       = totalOf(sales.filter(s=>s.status==="Paid"));
  const unpaidSales     = totalOf(sales.filter(s=>s.status==="Unpaid"));

  const kpis = [
    { label:"Total Revenue",       value: fmt(totalSales),     color:"blue" },
    { label:"Cost of Purchases",   value: fmt(totalPurchases), color:"yellow" },
    { label:"Gross Profit",        value: fmt(grossProfit),    color: grossProfit>=0?"green":"red" },
    { label:"Operating Expenses",  value: fmt(totalPayments),  color:"red" },
    { label:"Net Profit / (Loss)", value: fmt(netProfit),      color: netProfit>=0?"green":"red" },
    { label:"Cash Received",       value: fmt(totalReceipts),  color:"green" },
    { label:"Total Meters Sold",   value: fmtNum(totalMetersSold)+"m", color:"teal" },
    { label:"Profit / Meter",      value: fmt(profitPerMeter)+"/m", color:"purple" },
  ];

  document.getElementById("reportsGrid").innerHTML = kpis.map(k => `
    <div class="metric-card ${k.color}">
      <div class="metric-label">${k.label}</div>
      <div class="metric-value">${k.value}</div>
    </div>
  `).join("");

  document.getElementById("incomeStatement").innerHTML = `
    <div class="is-row"><span class="is-label">Sales Revenue</span><span class="is-value positive">${fmt(totalSales)}</span></div>
    <div class="is-row"><span class="is-label">  — Paid</span><span class="is-value">${fmt(paidSales)}</span></div>
    <div class="is-row"><span class="is-label">  — Unpaid (Receivable)</span><span class="is-value">${fmt(unpaidSales)}</span></div>
    <div class="is-row"><span class="is-label">Less: Purchases</span><span class="is-value negative">− ${fmt(totalPurchases)}</span></div>
    <div class="is-row"><span class="is-label">Gross Profit</span><span class="is-value ${grossProfit>=0?"positive":"negative"}">${fmt(grossProfit)}</span></div>
    <div class="is-row"><span class="is-label">Less: Expenses</span><span class="is-value negative">− ${fmt(totalPayments)}</span></div>
    <div class="is-row total-row">
      <span class="is-label" style="font-weight:700;color:var(--text-primary)">NET PROFIT / (LOSS)</span>
      <span class="is-value ${netProfit>=0?"positive":"negative"}" style="font-size:15px">${fmt(netProfit)}</span>
    </div>
  `;

  const maxCF   = Math.max(totalReceipts, totalPayments, 1);
  const recPct  = Math.round((totalReceipts / maxCF) * 100);
  const payPct  = Math.round((totalPayments / maxCF) * 100);
  document.getElementById("cashflowVisual").innerHTML = `
    <div class="cf-bar-row">
      <div class="cf-bar-label"><span>Cash Receipts (Inflow)</span><span>${fmt(totalReceipts)}</span></div>
      <div class="cf-bar-track"><div class="cf-bar-fill receipts-bar" style="width:${recPct}%"></div></div>
    </div>
    <div class="cf-bar-row">
      <div class="cf-bar-label"><span>Cash Payments (Outflow)</span><span>${fmt(totalPayments)}</span></div>
      <div class="cf-bar-track"><div class="cf-bar-fill payments-bar" style="width:${payPct}%"></div></div>
    </div>
    <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">
      <div class="cf-bar-label">
        <span style="color:var(--text-primary);font-weight:600">Net Cash Position</span>
        <span style="color:${(totalReceipts-totalPayments)>=0?"var(--green)":"var(--red)"};font-weight:700">${fmt(totalReceipts-totalPayments)}</span>
      </div>
    </div>
  `;

  renderMonthlyTable();
}

function renderMonthlyTable() {
  const allDates = [...sales.map(x=>x.date),...purchases.map(x=>x.date),...receipts.map(x=>x.date),...payments.map(x=>x.date)];
  const months   = [...new Set(allDates.map(d=>d.substring(0,7)))].sort();
  const tbody    = document.querySelector("#monthlyTable tbody");
  if (!months.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No data available.</td></tr>`; return;
  }
  tbody.innerHTML = months.map(ym => {
    const mS = totalOf(sales.filter(x=>x.date.startsWith(ym)));
    const mP = totalOf(purchases.filter(x=>x.date.startsWith(ym)));
    const mR = totalOf(receipts.filter(x=>x.date.startsWith(ym)));
    const mPy= totalOf(payments.filter(x=>x.date.startsWith(ym)));
    const mN = mS - mP - mPy;
    const label = new Date(ym+"-01").toLocaleDateString("en-GB",{month:"short",year:"numeric"});
    return `
      <tr>
        <td><strong>${label}</strong></td>
        <td class="amount-cell" style="color:var(--blue-bright)">${fmt(mS)}</td>
        <td class="amount-cell" style="color:var(--yellow)">${fmt(mP)}</td>
        <td class="amount-cell" style="color:var(--green)">${fmt(mR)}</td>
        <td class="amount-cell" style="color:var(--red)">${fmt(mPy)}</td>
        <td class="amount-cell" style="color:${mN>=0?"var(--green)":"var(--red)"};font-weight:700">${fmt(mN)}</td>
      </tr>
    `;
  }).join("");
}

// ============================================
// CLEAR FORMS
// ============================================
function clearForm(type) {
  const map = {
    sale:     ["saleCustomer","saleFabric","saleItem","saleQuality","saleMeters","salePricePerMeter","saleAmount","saleDate"],
    purchase: ["purchaseSupplier","purchaseFabric","purchaseItem","purchaseQuality","purchaseMeters","purchasePricePerMeter","purchaseAmount","purchaseDate"],
    payment:  ["paymentTo","paymentAmount","paymentPurpose","paymentDate"],
    receipt:  ["receiptFrom","receiptAmount","receiptPurpose","receiptDate"],
  };
  (map[type]||[]).forEach(id => { const el=document.getElementById(id); if(el) el.value=""; });
}

// ============================================
// SIDEBAR TOGGLE
// ============================================
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarOverlay")?.classList.remove("active");
}

// ============================================
// DATE
// ============================================
function updateDate() {
  const el = document.getElementById("topbarDate");
  if (el) el.textContent = new Date().toLocaleDateString("en-GB",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});
}

// ============================================
// INIT (called after login)
// ============================================
function init() {
  ["saleDate","purchaseDate","paymentDate","receiptDate"].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value) el.value = today();
  });

  document.querySelectorAll(".nav-item[data-section]").forEach(el => {
    el.addEventListener("click", e => { e.preventDefault(); switchSection(el.dataset.section); });
  });
  document.querySelectorAll(".btn-link[data-section]").forEach(el => {
    el.addEventListener("click", () => switchSection(el.dataset.section));
  });

  const toggle  = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");
  if (!document.getElementById("sidebarOverlay")) {
    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay"; overlay.id = "sidebarOverlay";
    document.body.appendChild(overlay);
    overlay.addEventListener("click", closeSidebar);
  }
  toggle?.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    document.getElementById("sidebarOverlay").classList.toggle("active", isOpen);
  });

  updateDate();
  setInterval(updateDate, 60000);
  switchSection("dashboard");
}

// ============================================
// DOM READY — just show login
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginPassword").focus();
});