/* =============================================
   LEDGERPRO — BUSINESS ACCOUNTING DASHBOARD
   script.js — Data, Logic, UI Controller
   ============================================= */

"use strict";

// ============================================
// DUMMY DATA
// ============================================

let sales = [
  { id: 1, customer: "Al-Amin Traders",      item: "Cotton Fabric 50m",        amount: 85000,  date: "2025-10-05", status: "Paid" },
  { id: 2, customer: "Zeshan Enterprises",   item: "Polyester Thread Spools",  amount: 32500,  date: "2025-10-12", status: "Unpaid" },
  { id: 3, customer: "Noor Textiles Ltd",    item: "Denim Fabric 30m",         amount: 54000,  date: "2025-10-18", status: "Paid" },
  { id: 4, customer: "Abbas & Co.",          item: "Synthetic Lining Cloth",   amount: 18750,  date: "2025-11-02", status: "Paid" },
  { id: 5, customer: "Raheel Brothers",      item: "Cotton Fabric 100m",       amount: 170000, date: "2025-11-15", status: "Unpaid" },
  { id: 6, customer: "Gulf Textile Export",  item: "Export Batch #A220",       amount: 245000, date: "2025-12-01", status: "Paid" },
  { id: 7, customer: "City Fashion Hub",     item: "Silk Blend 25m",           amount: 61000,  date: "2026-01-08", status: "Paid" },
  { id: 8, customer: "Prime Garments",       item: "Chiffon 40m",              amount: 47500,  date: "2026-01-22", status: "Unpaid" },
];

let purchases = [
  { id: 1, supplier: "Karachi Wholesale Co.",   item: "Raw Cotton 500kg",       amount: 62000,  date: "2025-10-03", status: "Paid" },
  { id: 2, supplier: "Sindh Yarn Mills",        item: "Polyester Yarn 200kg",   amount: 38500,  date: "2025-10-10", status: "Paid" },
  { id: 3, supplier: "Pakistan Dye Corp",       item: "Industrial Dyes Set",    amount: 29000,  date: "2025-10-20", status: "Unpaid" },
  { id: 4, supplier: "Gulshan Machinery",       item: "Loom Spare Parts",       amount: 15000,  date: "2025-11-05", status: "Paid" },
  { id: 5, supplier: "Metro Packaging Pvt.",    item: "Carton Boxes 1000 pcs",  amount: 8500,   date: "2025-11-18", status: "Paid" },
  { id: 6, supplier: "Karachi Wholesale Co.",   item: "Raw Cotton 800kg",       amount: 98000,  date: "2025-12-05", status: "Unpaid" },
  { id: 7, supplier: "Tech Textile Supplies",   item: "Weaving Chemicals",      amount: 21000,  date: "2026-01-10", status: "Paid" },
];

let payments = [
  { id: 1, payTo: "Karachi Wholesale Co.",   purpose: "Invoice #KW-0041 Settlement",  amount: 62000,  date: "2025-10-08" },
  { id: 2, payTo: "Sindh Yarn Mills",        purpose: "Invoice #SYM-112 Full Pay",    amount: 38500,  date: "2025-10-14" },
  { id: 3, payTo: "Gulshan Machinery",       purpose: "Spare Parts Invoice #GM-78",   amount: 15000,  date: "2025-11-07" },
  { id: 4, payTo: "KESC Utilities",          purpose: "October Electricity Bill",     amount: 12400,  date: "2025-11-01" },
  { id: 5, payTo: "Factory Rent",            purpose: "November Rent Payment",        amount: 45000,  date: "2025-11-01" },
  { id: 6, payTo: "Tech Textile Supplies",   purpose: "Invoice #TTS-291",             amount: 21000,  date: "2026-01-13" },
  { id: 7, payTo: "KESC Utilities",          purpose: "December Electricity Bill",    amount: 13800,  date: "2025-12-03" },
  { id: 8, payTo: "Factory Rent",            purpose: "December Rent Payment",        amount: 45000,  date: "2025-12-01" },
];

let receipts = [
  { id: 1, from: "Al-Amin Traders",     purpose: "Invoice #S001 Full Payment",   amount: 85000,  date: "2025-10-07" },
  { id: 2, from: "Noor Textiles Ltd",   purpose: "Invoice #S003 Full Payment",   amount: 54000,  date: "2025-10-20" },
  { id: 3, from: "Abbas & Co.",         purpose: "Invoice #S004 Full Payment",   amount: 18750,  date: "2025-11-04" },
  { id: 4, from: "Gulf Textile Export", purpose: "Export Invoice #GTE-001",      amount: 245000, date: "2025-12-04" },
  { id: 5, from: "City Fashion Hub",    purpose: "Invoice #S007 Full Payment",   amount: 61000,  date: "2026-01-10" },
  { id: 6, from: "Zeshan Enterprises",  purpose: "Partial Payment on Account",   amount: 15000,  date: "2025-11-20" },
];

// Auto-increment IDs
let nextSaleId     = sales.length + 1;
let nextPurchaseId = purchases.length + 1;
let nextPaymentId  = payments.length + 1;
let nextReceiptId  = receipts.length + 1;

// ============================================
// UTILITY FUNCTIONS
// ============================================

const fmt = (n) => "Rs " + Number(n).toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function today() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function showToast(msg, type = "info") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show " + type;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { t.className = "toast"; }, 3000);
}

function statusBadge(status) {
  const cls = status === "Paid" ? "badge-paid" : "badge-unpaid";
  return `<span class="badge ${cls}">${status}</span>`;
}

function typeBadge(type) {
  const map = {
    "Sale":     "badge-sale",
    "Purchase": "badge-purchase",
    "Receipt":  "badge-receipt",
    "Payment":  "badge-payment",
  };
  return `<span class="badge ${map[type] || ""}">${type}</span>`;
}

function totalOf(arr, key = "amount") {
  return arr.reduce((s, x) => s + Number(x[key] || 0), 0);
}

// ============================================
// NAVIGATION (SPA-style)
// ============================================

const SECTIONS = ["dashboard", "sales", "purchases", "payments", "receipts", "ledger", "reports"];
const SECTION_LABELS = {
  dashboard: "Dashboard", sales: "Sales", purchases: "Purchases",
  payments: "Payments", receipts: "Receipts", ledger: "Ledger", reports: "Reports"
};

function switchSection(name) {
  SECTIONS.forEach(s => {
    document.getElementById("section-" + s)?.classList.remove("active");
  });
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.section === name);
  });

  const el = document.getElementById("section-" + name);
  if (el) el.classList.add("active");

  document.getElementById("breadcrumbCurrent").textContent = SECTION_LABELS[name] || name;

  // Render section-specific content
  if (name === "dashboard")  renderDashboard();
  if (name === "sales")      renderSalesTable();
  if (name === "purchases")  renderPurchasesTable();
  if (name === "payments")   renderPaymentsTable();
  if (name === "receipts")   renderReceiptsTable();
  if (name === "ledger")     renderLedger();
  if (name === "reports")    renderReports();

  // Close sidebar on mobile
  if (window.innerWidth < 700) closeSidebar();
}

// ============================================
// DASHBOARD
// ============================================

function renderDashboard() {
  const totalSales     = totalOf(sales);
  const totalPurchases = totalOf(purchases);
  const totalReceipts  = totalOf(receipts);
  const totalPayments  = totalOf(payments);
  const netProfit      = totalSales - totalPurchases - totalPayments;

  const metrics = [
    { label: "Total Sales",      value: fmt(totalSales),     color: "blue",   icon: "↑", cls: "" },
    { label: "Total Purchases",  value: fmt(totalPurchases), color: "yellow", icon: "↓", cls: "" },
    { label: "Total Receipts",   value: fmt(totalReceipts),  color: "green",  icon: "⊞", cls: "" },
    { label: "Total Payments",   value: fmt(totalPayments),  color: "red",    icon: "⊟", cls: "" },
    { label: "Net Profit",       value: fmt(netProfit),      color: "purple", icon: "◈", cls: netProfit >= 0 ? "positive" : "negative" },
  ];

  const grid = document.getElementById("metricGrid");
  grid.innerHTML = metrics.map(m => `
    <div class="metric-card ${m.color}">
      <div class="metric-label">${m.label}</div>
      <div class="metric-value ${m.cls}">${m.value}</div>
      <div class="metric-change">${m.label === "Net Profit" ? (netProfit >= 0 ? "▲ Profitable" : "▼ Loss") : sales.length + " records"}</div>
      <span class="metric-icon">${m.icon}</span>
    </div>
  `).join("");

  // Recent sales (last 5)
  const recentSales = [...sales].reverse().slice(0, 5);
  const sTbody = document.querySelector("#dashSalesTable tbody");
  sTbody.innerHTML = recentSales.length ? recentSales.map(s => `
    <tr>
      <td>${s.customer}</td>
      <td>${s.item}</td>
      <td class="amount-cell">${fmt(s.amount)}</td>
      <td>${statusBadge(s.status)}</td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="4">No sales records</td></tr>`;

  // Recent purchases (last 5)
  const recentPurchases = [...purchases].reverse().slice(0, 5);
  const pTbody = document.querySelector("#dashPurchasesTable tbody");
  pTbody.innerHTML = recentPurchases.length ? recentPurchases.map(p => `
    <tr>
      <td>${p.supplier}</td>
      <td>${p.item}</td>
      <td class="amount-cell">${fmt(p.amount)}</td>
      <td>${statusBadge(p.status)}</td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="4">No purchase records</td></tr>`;
}

// ============================================
// SALES
// ============================================

function renderSalesTable() {
  const tbody = document.querySelector("#salesTable tbody");
  document.getElementById("salesCount").textContent = sales.length + " entries";

  if (!sales.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No sales records yet. Add one above.</td></tr>`;
    return;
  }
  tbody.innerHTML = sales.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${s.customer}</td>
      <td>${s.item}</td>
      <td class="amount-cell">${fmt(s.amount)}</td>
      <td>${formatDate(s.date)}</td>
      <td>${statusBadge(s.status)}</td>
      <td><button class="btn-danger" onclick="deleteSale(${s.id})">DELETE</button></td>
    </tr>
  `).join("");
}

function addSale() {
  const customer = document.getElementById("saleCustomer").value.trim();
  const item     = document.getElementById("saleItem").value.trim();
  const amount   = parseFloat(document.getElementById("saleAmount").value);
  const date     = document.getElementById("saleDate").value;
  const status   = document.getElementById("saleStatus").value;

  if (!customer || !item || !amount || !date) {
    showToast("All fields are required.", "error"); return;
  }
  if (amount <= 0) {
    showToast("Amount must be greater than zero.", "error"); return;
  }

  sales.push({ id: nextSaleId++, customer, item, amount, date, status });
  clearForm("sale");
  renderSalesTable();
  showToast("Sale record added successfully.", "success");
}

function deleteSale(id) {
  if (!confirm("Delete this sale record?")) return;
  sales = sales.filter(s => s.id !== id);
  renderSalesTable();
  showToast("Sale record deleted.", "info");
}

// ============================================
// PURCHASES
// ============================================

function renderPurchasesTable() {
  const tbody = document.querySelector("#purchasesTable tbody");
  document.getElementById("purchasesCount").textContent = purchases.length + " entries";

  if (!purchases.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No purchase records yet. Add one above.</td></tr>`;
    return;
  }
  tbody.innerHTML = purchases.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${p.supplier}</td>
      <td>${p.item}</td>
      <td class="amount-cell">${fmt(p.amount)}</td>
      <td>${formatDate(p.date)}</td>
      <td>${statusBadge(p.status)}</td>
      <td><button class="btn-danger" onclick="deletePurchase(${p.id})">DELETE</button></td>
    </tr>
  `).join("");
}

function addPurchase() {
  const supplier = document.getElementById("purchaseSupplier").value.trim();
  const item     = document.getElementById("purchaseItem").value.trim();
  const amount   = parseFloat(document.getElementById("purchaseAmount").value);
  const date     = document.getElementById("purchaseDate").value;
  const status   = document.getElementById("purchaseStatus").value;

  if (!supplier || !item || !amount || !date) {
    showToast("All fields are required.", "error"); return;
  }
  if (amount <= 0) {
    showToast("Amount must be greater than zero.", "error"); return;
  }

  purchases.push({ id: nextPurchaseId++, supplier, item, amount, date, status });
  clearForm("purchase");
  renderPurchasesTable();
  showToast("Purchase record added successfully.", "success");
}

function deletePurchase(id) {
  if (!confirm("Delete this purchase record?")) return;
  purchases = purchases.filter(p => p.id !== id);
  renderPurchasesTable();
  showToast("Purchase record deleted.", "info");
}

// ============================================
// PAYMENTS
// ============================================

function renderPaymentsTable() {
  const tbody = document.querySelector("#paymentsTable tbody");
  document.getElementById("paymentsCount").textContent = payments.length + " entries";

  if (!payments.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No payment records yet. Add one above.</td></tr>`;
    return;
  }
  tbody.innerHTML = payments.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${p.payTo}</td>
      <td>${p.purpose}</td>
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

  if (!payTo || !amount || !purpose || !date) {
    showToast("All fields are required.", "error"); return;
  }
  if (amount <= 0) {
    showToast("Amount must be greater than zero.", "error"); return;
  }

  payments.push({ id: nextPaymentId++, payTo, amount, purpose, date });
  clearForm("payment");
  renderPaymentsTable();
  showToast("Payment record added successfully.", "success");
}

function deletePayment(id) {
  if (!confirm("Delete this payment record?")) return;
  payments = payments.filter(p => p.id !== id);
  renderPaymentsTable();
  showToast("Payment record deleted.", "info");
}

// ============================================
// RECEIPTS
// ============================================

function renderReceiptsTable() {
  const tbody = document.querySelector("#receiptsTable tbody");
  document.getElementById("receiptsCount").textContent = receipts.length + " entries";

  if (!receipts.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No receipt records yet. Add one above.</td></tr>`;
    return;
  }
  tbody.innerHTML = receipts.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${r.from}</td>
      <td>${r.purpose}</td>
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

  if (!from || !amount || !purpose || !date) {
    showToast("All fields are required.", "error"); return;
  }
  if (amount <= 0) {
    showToast("Amount must be greater than zero.", "error"); return;
  }

  receipts.push({ id: nextReceiptId++, from, amount, purpose, date });
  clearForm("receipt");
  renderReceiptsTable();
  showToast("Receipt record added successfully.", "success");
}

function deleteReceipt(id) {
  if (!confirm("Delete this receipt record?")) return;
  receipts = receipts.filter(r => r.id !== id);
  renderReceiptsTable();
  showToast("Receipt record deleted.", "info");
}

// ============================================
// LEDGER
// ============================================

function buildLedgerEntries() {
  const entries = [];

  // Sales = Credit (money coming in)
  sales.forEach(s => entries.push({
    date: s.date, name: s.customer,
    description: "Sale: " + s.item,
    type: "Sale",
    debit: 0, credit: s.amount
  }));

  // Purchases = Debit (money going out)
  purchases.forEach(p => entries.push({
    date: p.date, name: p.supplier,
    description: "Purchase: " + p.item,
    type: "Purchase",
    debit: p.amount, credit: 0
  }));

  // Payments = Debit
  payments.forEach(p => entries.push({
    date: p.date, name: p.payTo,
    description: "Payment: " + p.purpose,
    type: "Payment",
    debit: p.amount, credit: 0
  }));

  // Receipts = Credit
  receipts.forEach(r => entries.push({
    date: r.date, name: r.from,
    description: "Receipt: " + r.purpose,
    type: "Receipt",
    debit: 0, credit: r.amount
  }));

  // Sort by date
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  return entries;
}

function renderLedger() {
  const entries = buildLedgerEntries();
  const tbody = document.querySelector("#ledgerTable tbody");
  document.getElementById("ledgerCount").textContent = entries.length + " entries";

  let totalDebit = 0, totalCredit = 0, balance = 0;

  if (!entries.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="8">No ledger entries available.</td></tr>`;
    return;
  }

  tbody.innerHTML = entries.map((e, i) => {
    totalDebit  += e.debit;
    totalCredit += e.credit;
    balance     += (e.credit - e.debit);
    const balCls = balance >= 0 ? "col-credit" : "col-debit";
    return `
    <tr>
      <td>${i + 1}</td>
      <td>${formatDate(e.date)}</td>
      <td>${e.name}</td>
      <td>${e.description}</td>
      <td>${typeBadge(e.type)}</td>
      <td class="amount-cell col-debit">${e.debit ? fmt(e.debit) : "—"}</td>
      <td class="amount-cell col-credit">${e.credit ? fmt(e.credit) : "—"}</td>
      <td class="amount-cell ${balCls}">${fmt(balance)}</td>
    </tr>
  `;
  }).join("");

  // Summary
  const summary = document.getElementById("ledgerSummary");
  const netBalance = totalCredit - totalDebit;
  summary.innerHTML = `
    <div class="ledger-summary-card">
      <div class="ledger-summary-label">Total Debit</div>
      <div class="ledger-summary-value col-debit">${fmt(totalDebit)}</div>
    </div>
    <div class="ledger-summary-card">
      <div class="ledger-summary-label">Total Credit</div>
      <div class="ledger-summary-value col-credit">${fmt(totalCredit)}</div>
    </div>
    <div class="ledger-summary-card">
      <div class="ledger-summary-label">Net Balance</div>
      <div class="ledger-summary-value ${netBalance >= 0 ? "col-credit" : "col-debit"}">${fmt(netBalance)}</div>
    </div>
  `;
}

// ============================================
// REPORTS
// ============================================

function renderReports() {
  const totalSales     = totalOf(sales);
  const totalPurchases = totalOf(purchases);
  const totalReceipts  = totalOf(receipts);
  const totalPayments  = totalOf(payments);
  const grossProfit    = totalSales - totalPurchases;
  const netProfit      = grossProfit - totalPayments;
  const paidSales      = totalOf(sales.filter(s => s.status === "Paid"));
  const unpaidSales    = totalOf(sales.filter(s => s.status === "Unpaid"));

  // Report KPI cards
  const kpis = [
    { label: "Total Revenue",    value: fmt(totalSales),     color: "blue" },
    { label: "Cost of Purchases", value: fmt(totalPurchases), color: "yellow" },
    { label: "Gross Profit",     value: fmt(grossProfit),    color: grossProfit >= 0 ? "green" : "red" },
    { label: "Total Expenses",   value: fmt(totalPayments),  color: "red" },
    { label: "Net Profit",       value: fmt(netProfit),      color: netProfit >= 0 ? "green" : "red" },
    { label: "Cash Received",    value: fmt(totalReceipts),  color: "green" },
  ];

  document.getElementById("reportsGrid").innerHTML = kpis.map(k => `
    <div class="metric-card ${k.color}">
      <div class="metric-label">${k.label}</div>
      <div class="metric-value">${k.value}</div>
    </div>
  `).join("");

  // Income Statement
  document.getElementById("incomeStatement").innerHTML = `
    <div class="is-row">
      <span class="is-label">Total Sales Revenue</span>
      <span class="is-value positive">${fmt(totalSales)}</span>
    </div>
    <div class="is-row">
      <span class="is-label">  — Paid Sales</span>
      <span class="is-value">${fmt(paidSales)}</span>
    </div>
    <div class="is-row">
      <span class="is-label">  — Unpaid (Receivable)</span>
      <span class="is-value">${fmt(unpaidSales)}</span>
    </div>
    <div class="is-row">
      <span class="is-label">Less: Cost of Purchases</span>
      <span class="is-value negative">- ${fmt(totalPurchases)}</span>
    </div>
    <div class="is-row">
      <span class="is-label">Gross Profit</span>
      <span class="is-value ${grossProfit >= 0 ? "positive" : "negative"}">${fmt(grossProfit)}</span>
    </div>
    <div class="is-row">
      <span class="is-label">Less: Operating Expenses</span>
      <span class="is-value negative">- ${fmt(totalPayments)}</span>
    </div>
    <div class="is-row total-row">
      <span class="is-label" style="font-weight:700;color:var(--text-primary)">NET PROFIT / (LOSS)</span>
      <span class="is-value ${netProfit >= 0 ? "positive" : "negative"}" style="font-size:16px">${fmt(netProfit)}</span>
    </div>
  `;

  // Cash Flow bars
  const maxCF = Math.max(totalReceipts, totalPayments, 1);
  const recPct = Math.round((totalReceipts / maxCF) * 100);
  const payPct = Math.round((totalPayments / maxCF) * 100);
  document.getElementById("cashflowVisual").innerHTML = `
    <div class="cf-bar-row">
      <div class="cf-bar-label">
        <span>Cash Receipts (Inflow)</span>
        <span>${fmt(totalReceipts)}</span>
      </div>
      <div class="cf-bar-track">
        <div class="cf-bar-fill receipts-bar" style="width:${recPct}%"></div>
      </div>
    </div>
    <div class="cf-bar-row">
      <div class="cf-bar-label">
        <span>Cash Payments (Outflow)</span>
        <span>${fmt(totalPayments)}</span>
      </div>
      <div class="cf-bar-track">
        <div class="cf-bar-fill payments-bar" style="width:${payPct}%"></div>
      </div>
    </div>
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">
      <div class="cf-bar-label">
        <span style="color:var(--text-primary);font-weight:600">Net Cash Position</span>
        <span style="color:${(totalReceipts - totalPayments) >= 0 ? "var(--green)" : "var(--red)"};font-weight:700">${fmt(totalReceipts - totalPayments)}</span>
      </div>
    </div>
  `;

  // Monthly Breakdown
  renderMonthlyTable();
}

function renderMonthlyTable() {
  // Gather all unique year-months
  const allDates = [
    ...sales.map(x => x.date),
    ...purchases.map(x => x.date),
    ...receipts.map(x => x.date),
    ...payments.map(x => x.date),
  ];
  const months = [...new Set(allDates.map(d => d.substring(0, 7)))].sort();

  const tbody = document.querySelector("#monthlyTable tbody");
  if (!months.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No data available.</td></tr>`;
    return;
  }

  tbody.innerHTML = months.map(ym => {
    const mSales     = totalOf(sales.filter(x => x.date.startsWith(ym)));
    const mPurchases = totalOf(purchases.filter(x => x.date.startsWith(ym)));
    const mReceipts  = totalOf(receipts.filter(x => x.date.startsWith(ym)));
    const mPayments  = totalOf(payments.filter(x => x.date.startsWith(ym)));
    const mNet       = mSales - mPurchases - mPayments;
    const label      = new Date(ym + "-01").toLocaleDateString("en-GB", { month: "short", year: "numeric" });

    return `
      <tr>
        <td><strong>${label}</strong></td>
        <td class="amount-cell" style="color:var(--blue-bright)">${fmt(mSales)}</td>
        <td class="amount-cell" style="color:var(--yellow)">${fmt(mPurchases)}</td>
        <td class="amount-cell" style="color:var(--green)">${fmt(mReceipts)}</td>
        <td class="amount-cell" style="color:var(--red)">${fmt(mPayments)}</td>
        <td class="amount-cell" style="color:${mNet >= 0 ? "var(--green)" : "var(--red)"};font-weight:700">${fmt(mNet)}</td>
      </tr>
    `;
  }).join("");
}

// ============================================
// CLEAR FORMS
// ============================================

function clearForm(type) {
  const fields = {
    sale:     ["saleCustomer","saleItem","saleAmount","saleDate"],
    purchase: ["purchaseSupplier","purchaseItem","purchaseAmount","purchaseDate"],
    payment:  ["paymentTo","paymentAmount","paymentPurpose","paymentDate"],
    receipt:  ["receiptFrom","receiptAmount","receiptPurpose","receiptDate"],
  };
  (fields[type] || []).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

// ============================================
// SIDEBAR TOGGLE (mobile)
// ============================================

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarOverlay")?.classList.remove("active");
}

// ============================================
// TOPBAR DATE
// ============================================

function updateDate() {
  const now = new Date();
  const str = now.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  document.getElementById("topbarDate").textContent = str;
}

// ============================================
// INIT
// ============================================

document.addEventListener("DOMContentLoaded", () => {

  // Set today's date for all date inputs
  ["saleDate","purchaseDate","paymentDate","receiptDate"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = today();
  });

  // Nav items
  document.querySelectorAll(".nav-item[data-section]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      switchSection(el.dataset.section);
    });
  });

  // btn-link in panels (View All)
  document.querySelectorAll(".btn-link[data-section]").forEach(el => {
    el.addEventListener("click", () => switchSection(el.dataset.section));
  });

  // Sidebar toggle (mobile)
  const toggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  overlay.id = "sidebarOverlay";
  document.body.appendChild(overlay);

  toggle?.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    overlay.classList.toggle("active", isOpen);
  });
  overlay.addEventListener("click", closeSidebar);

  // Date
  updateDate();
  setInterval(updateDate, 60000);

  // Initial render
  switchSection("dashboard");
});
