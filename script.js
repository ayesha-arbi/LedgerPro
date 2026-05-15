/* =============================================
   LEDGERPRO — FABRIC BUSINESS ACCOUNTING
   script.js — v3
   Payment Terms, Overdue Indicators,
   Item Autocomplete, Item Detail Modal
   ============================================= */
"use strict";

// ============================================
// PASSWORD / AUTH
// ============================================
const CORRECT_PASSWORD = "zahid";

function doLogin() {
  const input = document.getElementById("loginPassword");
  const error = document.getElementById("loginError");
  if (input.value === CORRECT_PASSWORD) {
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
  input.type  = input.type === "password" ? "text" : "password";
  btn.textContent = input.type === "password" ? "◎" : "◉";
}

// ============================================
// DATA
// ============================================
let sales = [
  // { id:1,  customer:"Al-Amin Traders",     fabric:"Cotton",    item:"Premium Cotton / 58,inch",      meters:500,  ppm:170, amount:85000,  date:"2025-10-05", terms:30 },
  // { id:2,  customer:"Zeshan Enterprises",  fabric:"Polyester", item:"Polyester Suiting / 60,inch",   meters:250,  ppm:130, amount:32500,  date:"2025-10-12", terms:45 },
  // { id:3,  customer:"Noor Textiles Ltd",   fabric:"Denim",     item:"Stretch Denim 12oz / 62,inch",  meters:300,  ppm:180, amount:54000,  date:"2025-10-18", terms:30 },
  // { id:4,  customer:"Abbas & Co.",         fabric:"Linen",     item:"Natural Linen Blend / 54,inch", meters:150,  ppm:125, amount:18750,  date:"2025-11-02", terms:15 },
  // { id:5,  customer:"Raheel Brothers",     fabric:"Cotton",    item:"Cotton Fabric Bulk / 58,inch",  meters:1000, ppm:170, amount:170000, date:"2025-11-15", terms:60 },
  // { id:6,  customer:"Gulf Textile Export", fabric:"Lawn",      item:"Export Lawn Premium / 44,inch", meters:1500, ppm:163, amount:245000, date:"2025-12-01", terms:30 },
  // { id:7,  customer:"City Fashion Hub",    fabric:"Silk",      item:"Pure Silk Blend / 44,inch",     meters:200,  ppm:305, amount:61000,  date:"2026-01-08", terms:30 },
  // { id:8,  customer:"Prime Garments",      fabric:"Chiffon",   item:"Printed Chiffon / 58,inch",     meters:380,  ppm:125, amount:47500,  date:"2026-01-22", terms:45 },
];

let purchases = [
  // { id:1,  supplier:"Karachi Wholesale Co.",  fabric:"Cotton",    item:"Raw Cotton Shirting / 58,inch",    quality:"A Standard",  meters:1000, ppm:62,  amount:62000,  date:"2025-10-03", terms:30,  status:"Paid" },
  // { id:2,  supplier:"Sindh Textile Mills",    fabric:"Polyester", item:"Polyester Grey Cloth / 60,inch",   quality:"B Grade",     meters:700,  ppm:55,  amount:38500,  date:"2025-10-10", terms:30,  status:"Paid" },
  // { id:3,  supplier:"Pakistan Dye Corp",      fabric:"Cotton",    item:"Dyed Cotton Fabric / 58,inch",     quality:"A Standard",  meters:580,  ppm:50,  amount:29000,  date:"2025-10-20", terms:60,  status:"Unpaid" },
  // { id:4,  supplier:"Gulshan Fabric House",   fabric:"Denim",     item:"Raw Denim 14oz / 62,inch",         quality:"A+ Premium",  meters:400,  ppm:100, amount:40000,  date:"2025-11-05", terms:30,  status:"Paid" },
  // { id:5,  supplier:"Metro Textiles Pvt.",    fabric:"Lawn",      item:"Lawn Base Cloth / 44,inch",        quality:"A Standard",  meters:2000, ppm:45,  amount:90000,  date:"2025-11-18", terms:45,  status:"Paid" },
  // { id:6,  supplier:"Karachi Wholesale Co.",  fabric:"Cotton",    item:"Cotton Shirting Bulk / 58,inch",   quality:"A Standard",  meters:1600, ppm:55,  amount:88000,  date:"2025-12-05", terms:30,  status:"Unpaid" },
  // { id:7,  supplier:"Silk Route Imports",     fabric:"Silk",      item:"Raw Silk Fabric / 44,inch",        quality:"A+ Premium",  meters:300,  ppm:170, amount:51000,  date:"2026-01-10", terms:30,  status:"Paid" },
  // { id:8,  supplier:"Chiffon World",          fabric:"Chiffon",   item:"Plain Chiffon Rolls / 58,inch",    quality:"B Grade",     meters:800,  ppm:70,  amount:56000,  date:"2026-01-15", terms:30,  status:"Paid" },
];

let payments = [
  // { id:1, payTo:"Karachi Wholesale Co.",  purpose:"Invoice #KW-0041 Settlement", amount:62000, date:"2025-10-08" },
  // { id:2, payTo:"Sindh Textile Mills",    purpose:"Invoice #STM-112 Full Pay",   amount:38500, date:"2025-10-14" },
  // { id:3, payTo:"Gulshan Fabric House",   purpose:"Denim Invoice #GF-78",        amount:40000, date:"2025-11-07" },
  // { id:4, payTo:"KESC Utilities",         purpose:"October Electricity Bill",    amount:12400, date:"2025-11-01" },
  // { id:5, payTo:"Factory Rent",           purpose:"November Rent",               amount:45000, date:"2025-11-01" },
  // { id:6, payTo:"Silk Route Imports",     purpose:"Invoice #SRI-291",            amount:51000, date:"2026-01-13" },
  // { id:7, payTo:"KESC Utilities",         purpose:"December Electricity",        amount:13800, date:"2025-12-03" },
  // { id:8, payTo:"Factory Rent",           purpose:"December Rent",               amount:45000, date:"2025-12-01" },
  // { id:9, payTo:"Chiffon World",          purpose:"Invoice #CW-015 Payment",     amount:56000, date:"2026-01-18" },
];

let receipts = [
  // { id:1, from:"Al-Amin Traders",     purpose:"Invoice #S001 Full Payment",  amount:85000,  date:"2025-10-07" },
  // { id:2, from:"Noor Textiles Ltd",   purpose:"Invoice #S003 Full Payment",  amount:54000,  date:"2025-10-20" },
  // { id:3, from:"Abbas & Co.",         purpose:"Invoice #S004 Full Payment",  amount:18750,  date:"2025-11-04" },
  // { id:4, from:"Gulf Textile Export", purpose:"Export Invoice #GTE-001",     amount:245000, date:"2025-12-04" },
  // { id:5, from:"City Fashion Hub",    purpose:"Invoice #S007 Full Payment",  amount:61000,  date:"2026-01-10" },
  // { id:6, from:"Zeshan Enterprises",  purpose:"Partial Payment on Account",  amount:15000,  date:"2025-11-20" },
];

let nextSaleId     = sales.length + 1;
let nextPurchaseId = purchases.length + 1;
let nextPaymentId  = payments.length + 1;
let nextReceiptId  = receipts.length + 1;

// ============================================
// UTILITIES
// ============================================
const fmt    = (n) => "Rs " + Number(n).toLocaleString("en-PK", { minimumFractionDigits:0, maximumFractionDigits:0 });
const fmtNum = (n) => Number(n).toLocaleString("en-PK", { minimumFractionDigits:0, maximumFractionDigits:1 });
const fmtRaw = (n) => Number(n).toLocaleString("en-PK", { minimumFractionDigits:0, maximumFractionDigits:0 });

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
  const map = { "A+ Premium":"badge-q-aplus","A Standard":"badge-q-a","B Grade":"badge-q-b","C Export":"badge-q-c","Seconds":"badge-q-seconds" };
  return `<span class="badge ${map[q]||"badge-q-a"}">${q}</span>`;
}

function typeBadge(type) {
  const map = { Sale:"badge-sale", Purchase:"badge-purchase", Receipt:"badge-receipt", Payment:"badge-payment" };
  return `<span class="badge ${map[type]||""}">${type}</span>`;
}

function totalOf(arr, key = "amount") {
  return arr.reduce((s, x) => s + Number(x[key] || 0), 0);
}

function sortData(arr, sortVal, nameKey) {
  const a = [...arr];
  if (sortVal === "date-asc")    return a.sort((x,y) => new Date(x.date) - new Date(y.date));
  if (sortVal === "date-desc")   return a.sort((x,y) => new Date(y.date) - new Date(x.date));
  if (sortVal === "amount-asc")  return a.sort((x,y) => x.amount - y.amount);
  if (sortVal === "amount-desc") return a.sort((x,y) => y.amount - x.amount);
  if (sortVal === nameKey+"-asc")  return a.sort((x,y) => (x[nameKey]||"").localeCompare(y[nameKey]||""));
  if (sortVal === nameKey+"-desc") return a.sort((x,y) => (y[nameKey]||"").localeCompare(x[nameKey]||""));
  if (sortVal === "name-asc") return a.sort((x,y) => ((x[nameKey]||x.payTo||x.from||"")).localeCompare(y[nameKey]||y.payTo||y.from||""));
  return a;
}

// ============================================
// OVERDUE / PAYMENT TERMS
// ============================================
/**
 * Given a date string and number-of-days terms,
 * returns an HTML indicator badge.
 * For sales: tracks whether customer has paid (no status on sales in v3,
 *   so we just show the window and days remaining).
 * For purchases: also checks status.
 */
function dueBadge(date, terms, paidStatus) {
  if (!terms || !date) return `<span class="overdue-indicator due-none">— No terms</span>`;

  const start   = new Date(date + "T00:00:00");
  const dueDate = new Date(start);
  dueDate.setDate(dueDate.getDate() + Number(terms));
  const now     = new Date();
  now.setHours(0,0,0,0);

  // If already paid/receipt matched, show settled
  if (paidStatus === "Paid") {
    return `<span class="overdue-indicator due-ok"><span class="overdue-dot ok"></span>PAID</span>`;
  }

  const diffMs   = dueDate - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `<span class="overdue-indicator due-over"><span class="overdue-dot over"></span>OVERDUE ${Math.abs(diffDays)}d</span>`;
  }
  if (diffDays <= 7) {
    return `<span class="overdue-indicator due-soon"><span class="overdue-dot soon"></span>DUE IN ${diffDays}d</span>`;
  }
  return `<span class="overdue-indicator due-ok"><span class="overdue-dot ok"></span>${diffDays}d LEFT</span>`;
}

function dueText(date, terms) {
  if (!terms || !date) return "—";
  const start   = new Date(date + "T00:00:00");
  const dueDate = new Date(start);
  dueDate.setDate(dueDate.getDate() + Number(terms));
  return formatDate(dueDate.toISOString().split("T")[0]);
}

// ============================================
// AUTO-CALC
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
// ITEM AUTOCOMPLETE
// ============================================
// Build list of all unique items ever entered
function getItemList() {
  const all = [
    ...sales.map(s => s.item),
    ...purchases.map(p => p.item),
  ].filter(Boolean);
  return [...new Set(all)].sort();
}

let _itemDropdownTimeout = {};

function handleItemInput(type) {
  const inputEl = document.getElementById(type === "sale" ? "saleItem" : "purchaseItem");
  const val = inputEl.value.trim().toLowerCase();
  const dropEl = document.getElementById(type === "sale" ? "saleItemDropdown" : "purchaseItemDropdown");

  const items = getItemList();
  const filtered = val.length >= 1
    ? items.filter(i => i.toLowerCase().includes(val))
    : items;

  if (!filtered.length) {
    dropEl.classList.remove("open");
    return;
  }

  dropEl.innerHTML = filtered.map((item, idx) =>
    `<div class="item-dropdown-item" data-idx="${idx}" onmousedown="selectItem('${type}','${item.replace(/'/g,"\\'")}')">
      ${item}
    </div>`
  ).join("");
  dropEl.classList.add("open");
}

function openItemDropdown(type) {
  // Show full list on focus
  handleItemInput(type);
}

function closeItemDropdown(type, delay = 0) {
  clearTimeout(_itemDropdownTimeout[type]);
  _itemDropdownTimeout[type] = setTimeout(() => {
    const id = type === "sale" ? "saleItemDropdown" : "purchaseItemDropdown";
    document.getElementById(id).classList.remove("open");
  }, delay);
}

function selectItem(type, val) {
  const inputEl = document.getElementById(type === "sale" ? "saleItem" : "purchaseItem");
  inputEl.value = val;
  closeItemDropdown(type, 0);
}

function handleItemKey(e, type) {
  const dropEl = document.getElementById(type === "sale" ? "saleItemDropdown" : "purchaseItemDropdown");
  const items  = dropEl.querySelectorAll(".item-dropdown-item");
  let   cur    = dropEl.querySelector(".item-dropdown-item.highlighted");

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (!cur) { items[0]?.classList.add("highlighted"); }
    else {
      cur.classList.remove("highlighted");
      const next = cur.nextElementSibling;
      (next || items[0]).classList.add("highlighted");
    }
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!cur) { items[items.length-1]?.classList.add("highlighted"); }
    else {
      cur.classList.remove("highlighted");
      const prev = cur.previousElementSibling;
      (prev || items[items.length-1]).classList.add("highlighted");
    }
  } else if (e.key === "Enter") {
    if (cur) { e.preventDefault(); selectItem(type, cur.textContent.trim()); }
  } else if (e.key === "Escape") {
    closeItemDropdown(type, 0);
  }
}

// ============================================
// NAVIGATION
// ============================================
const SECTIONS = ["dashboard","sales","purchases","payments","receipts","ledger","party-ledger","trial-balance","inventory","reports"];
const SECTION_LABELS = {
  dashboard:"Dashboard", sales:"Sales", purchases:"Purchases",
  payments:"Payments", receipts:"Receipts", ledger:"General Ledger",
  "party-ledger":"Party Ledgers", "trial-balance":"Trial Balance",
  inventory:"Inventory", reports:"Reports"
};

function switchSection(name) {
  SECTIONS.forEach(s => document.getElementById("section-"+s)?.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.section === name));
  document.getElementById("section-"+name)?.classList.add("active");
  document.getElementById("breadcrumbCurrent").textContent = SECTION_LABELS[name] || name;

  const renderers = {
    dashboard:     renderDashboard,
    sales:         renderSalesTable,
    purchases:     renderPurchasesTable,
    payments:      renderPaymentsTable,
    receipts:      renderReceiptsTable,
    ledger:        renderLedger,
    "party-ledger": initPartyLedger,
    "trial-balance": renderTrialBalance,
    inventory:     renderInventory,
    reports:       renderReports,
  };
  renderers[name]?.();
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
  const profitPerMeter  = totalMetersSold ? (netProfit / totalMetersSold) : 0;

  const metrics = [
    { label:"Total Sales",       value: fmt(totalSales),     color:"blue",   icon:"↑", change: sales.length + " entries" },
    { label:"Total Purchases",   value: fmt(totalPurchases), color:"yellow", icon:"↓", change: purchases.length + " entries" },
    { label:"Total Receipts",    value: fmt(totalReceipts),  color:"green",  icon:"⊞", change: receipts.length + " entries" },
    { label:"Total Payments",    value: fmt(totalPayments),  color:"red",    icon:"⊟", change: payments.length + " entries" },
    { label:"Net Profit / Loss", value: fmt(netProfit),      color:"purple", icon:"◈", change: netProfit >= 0 ? "▲ Profitable" : "▼ Loss", cls: netProfit >= 0 ? "positive" : "negative" },
    { label:"Profit / Meter",    value: fmt(profitPerMeter), color:"teal",   icon:"◐", change: fmtNum(totalMetersSold) + "m sold total", cls: profitPerMeter >= 0 ? "positive" : "negative" },
  ];

  document.getElementById("metricGrid").innerHTML = metrics.map(m => `
    <div class="metric-card ${m.color}">
      <div class="metric-label">${m.label}</div>
      <div class="metric-value ${m.cls||""}">${m.value}</div>
      <div class="metric-change">${m.change}</div>
      <span class="metric-icon">${m.icon}</span>
    </div>
  `).join("");

  const fabrics = [...new Set([...sales.map(s=>s.fabric), ...purchases.map(p=>p.fabric)].filter(Boolean))];
  document.getElementById("fabricInsightBar").innerHTML = fabrics.slice(0, 7).map(f => {
    const sold   = totalOf(sales.filter(s=>s.fabric===f), "meters");
    const bought = totalOf(purchases.filter(p=>p.fabric===f), "meters");
    const stock  = bought - sold;
    return `<div class="fib-card" onclick="openFabricDetail('${f}')">
      <div class="fib-label">${f.toUpperCase()}</div>
      <div class="fib-value">${fmtNum(stock)}m</div>
      <div class="fib-sub">Sold: ${fmtNum(sold)}m</div>
    </div>`;
  }).join("") || `<div class="fib-card"><div class="fib-label">No fabric data yet</div></div>`;

  const sTbody = document.querySelector("#dashSalesTable tbody");
  const rSales = [...sales].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0, 5);
  sTbody.innerHTML = rSales.length ? rSales.map(s => `
    <tr>
      <td>${s.customer}</td><td>${s.fabric||"—"}</td>
      <td class="meter-cell">${fmtNum(s.meters)}m</td>
      <td class="amount-cell">${fmt(s.amount)}</td>
      <td>${dueBadge(s.date, s.terms, null)}</td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="5">No sales records</td></tr>`;

  const pTbody = document.querySelector("#dashPurchasesTable tbody");
  const rPurch = [...purchases].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0, 5);
  pTbody.innerHTML = rPurch.length ? rPurch.map(p => `
    <tr>
      <td>${p.supplier}</td><td>${p.fabric||"—"}</td>
      <td class="meter-cell">${fmtNum(p.meters)}m</td>
      <td class="amount-cell">${fmt(p.amount)}</td>
      <td>${dueBadge(p.date, p.terms, p.status)}</td>
    </tr>
  `).join("") : `<tr class="empty-row"><td colspan="5">No purchase records</td></tr>`;
}

// ============================================
// SALES
// ============================================
function renderSalesTable() {
  const filter   = document.getElementById("salesFabricFilter")?.value || "";
  const sortVal  = document.getElementById("salesSortField")?.value || "date-desc";
  let data = filter ? sales.filter(s => s.fabric === filter) : [...sales];
  data = sortData(data, sortVal, "customer");
  document.getElementById("salesCount").textContent = data.length + " entries";

  const tbody = document.querySelector("#salesTable tbody");
  if (!data.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="12">No sales records${filter ? " for " + filter : ""}. Add one above.</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map((s, i) => `
    <tr>
      <td>${i+1}</td>
      <td>${s.customer}</td>
      <td>${s.fabric||"—"}</td>
      <td style="font-size:11px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.item||"—"}</td>
      <td class="meter-cell">${fmtNum(s.meters)}m</td>
      <td class="rate-cell">${fmt(s.ppm)}/m</td>
      <td class="amount-cell">${fmt(s.amount)}</td>
      <td>${formatDate(s.date)}</td>
      <td class="terms-cell">${dueBadge(s.date, s.terms, null)}<br><span style="font-size:9px;color:var(--text-muted)">${s.terms ? dueText(s.date,s.terms) : "—"}</span></td>
      <td><button class="btn-invoice" onclick="openInvoice(${s.id})">⎙ Invoice</button></td>
      <td><button class="btn-detail" onclick="openItemDetail(${s.id},'sale')">◉ Details</button></td>
      <td><button class="btn-danger" onclick="deleteSale(${s.id})">DELETE</button></td>
    </tr>
  `).join("");
}

function addSale() {
  const customer = document.getElementById("saleCustomer").value.trim();
  const fabric   = document.getElementById("saleFabric").value;
  const item     = document.getElementById("saleItem").value.trim();
  const meters   = parseFloat(document.getElementById("saleMeters").value);
  const ppm      = parseFloat(document.getElementById("salePricePerMeter").value);
  const amount   = parseFloat(document.getElementById("saleAmount").value);
  const date     = document.getElementById("saleDate").value;
  const terms    = parseInt(document.getElementById("saleTerms").value) || 0;

  if (!customer || !fabric || !item || !meters || !ppm || !date) { showToast("Please fill all required fields.", "error"); return; }
  if (meters <= 0 || ppm <= 0) { showToast("Meters and price must be > 0.", "error"); return; }

  // Validate item format
  if (!validateItemFormat(item)) {
    showToast("Item format must be: Name / Width,inch — e.g. Premium Cotton / 58,inch", "error");
    return;
  }

  // Check inventory
  const bought = totalOf(purchases.filter(p=>p.fabric===fabric), "meters");
  const alreadySold = totalOf(sales.filter(s=>s.fabric===fabric), "meters");
  const available = bought - alreadySold;
  if (meters > available) {
    if (!confirm(`⚠ Warning: Only ${fmtNum(available)}m of ${fabric} in stock but you're selling ${fmtNum(meters)}m. Proceed anyway?`)) return;
  }

  sales.push({ id: nextSaleId++, customer, fabric, item, meters, ppm, amount: amount || meters*ppm, date, terms });
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
  const filter  = document.getElementById("purchasesFabricFilter")?.value || "";
  const sortVal = document.getElementById("purchasesSortField")?.value || "date-desc";
  let data = filter ? purchases.filter(p => p.fabric === filter) : [...purchases];
  data = sortData(data, sortVal, "supplier");
  document.getElementById("purchasesCount").textContent = data.length + " entries";

  const tbody = document.querySelector("#purchasesTable tbody");
  if (!data.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="13">No purchase records${filter?" for "+filter:""}. Add one above.</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map((p, i) => `
    <tr>
      <td>${i+1}</td>
      <td>${p.supplier}</td>
      <td>${p.fabric||"—"}</td>
      <td style="font-size:11px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.item||"—"}</td>
      <td>${qualityBadge(p.quality)}</td>
      <td class="meter-cell">${fmtNum(p.meters)}m</td>
      <td class="rate-cell">${fmt(p.ppm)}/m</td>
      <td class="amount-cell">${fmt(p.amount)}</td>
      <td>${formatDate(p.date)}</td>
      <td class="terms-cell">${dueBadge(p.date, p.terms, p.status)}<br><span style="font-size:9px;color:var(--text-muted)">${p.terms ? dueText(p.date,p.terms) : "—"}</span></td>
      <td>${statusBadge(p.status)}</td>
      <td><button class="btn-detail" onclick="openItemDetail(${p.id},'purchase')">◉ Details</button></td>
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
  const terms    = parseInt(document.getElementById("purchaseTerms").value) || 0;
  const status   = document.getElementById("purchaseStatus").value;

  if (!supplier || !fabric || !item || !meters || !ppm || !date) { showToast("Please fill all required fields.", "error"); return; }
  if (meters <= 0 || ppm <= 0) { showToast("Meters and price must be > 0.", "error"); return; }

  if (!validateItemFormat(item)) {
    showToast("Item format must be: Name / Width,inch — e.g. Raw Cotton / 58,inch", "error");
    return;
  }

  purchases.push({ id: nextPurchaseId++, supplier, fabric, item, quality, meters, ppm, amount: amount||meters*ppm, date, terms, status });
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
// ITEM FORMAT VALIDATION
// ============================================
function validateItemFormat(val) {
  // Accepts: "Some text / number,inch" or "Some text / number,inch extra"
  // Must have: something / something,inch
  return /^.+\s*\/\s*.+,\s*inch/i.test(val.trim());
}

// ============================================
// PAYMENTS
// ============================================
function renderPaymentsTable() {
  const sortVal = document.getElementById("paymentsSortField")?.value || "date-desc";
  const data = sortData([...payments], sortVal, "payTo");
  document.getElementById("paymentsCount").textContent = data.length + " entries";
  const tbody = document.querySelector("#paymentsTable tbody");
  if (!data.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No payment records yet.</td></tr>`; return; }
  tbody.innerHTML = data.map((p,i) => `
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
  const sortVal = document.getElementById("receiptsSortField")?.value || "date-desc";
  const data = sortData([...receipts], sortVal, "from");
  document.getElementById("receiptsCount").textContent = data.length + " entries";
  const tbody = document.querySelector("#receiptsTable tbody");
  if (!data.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No receipt records yet.</td></tr>`; return; }
  tbody.innerHTML = data.map((r,i) => `
    <tr>
      <td>${i+1}</td><td>${r.from}</td><td>${r.purpose||"—"}</td>
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
  if (!from || !amount || !date) { showToast("Name, amount and date are required.", "error"); return; }
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
// ITEM DETAIL MODAL
// ============================================
function openItemDetail(id, type) {
  const record = type === "sale"
    ? sales.find(s => s.id === id)
    : purchases.find(p => p.id === id);
  if (!record) return;
  renderItemDetailModal(record, type);
}

function openFabricDetail(fabricName) {
  // Show all transactions for this fabric
  renderFabricDetailModal(fabricName);
}

function renderItemDetailModal(record, type) {
  const itemName = record.item || (type === "sale" ? record.fabric : record.fabric);
  const fabric   = record.fabric;

  // Parse item parts
  let baseName = itemName, width = "";
  if (itemName.includes("/")) {
    const parts = itemName.split("/");
    baseName = parts[0].trim();
    width    = parts[1] ? parts[1].trim() : "";
  }

  // Gather all transactions for this SPECIFIC item name (loose match)
  const itemSales = sales.filter(s => s.item === itemName || (s.item || "").startsWith(baseName));
  const itemPurchases = purchases.filter(p => p.item === itemName || (p.item || "").startsWith(baseName));

  // Also gather all for this fabric
  const fabricSales = sales.filter(s => s.fabric === fabric);
  const fabricPurchases = purchases.filter(p => p.fabric === fabric);

  const totalBought  = totalOf(itemPurchases, "meters");
  const totalSoldM   = totalOf(itemSales, "meters");
  const stockLeft    = totalBought - totalSoldM;
  const totalRevenue = totalOf(itemSales);
  const totalCost    = totalOf(itemPurchases);
  const margin       = totalRevenue - totalCost;

  // Build timeline: merge sales + purchases for this item, sort by date
  const timeline = [
    ...itemSales.map(s => ({
      date: s.date,
      type: "sale",
      party: s.customer,
      meters: s.meters,
      ppm: s.ppm,
      amount: s.amount,
      terms: s.terms,
      extra: dueBadge(s.date, s.terms, null)
    })),
    ...itemPurchases.map(p => ({
      date: p.date,
      type: "purchase",
      party: p.supplier,
      meters: p.meters,
      ppm: p.ppm,
      amount: p.amount,
      quality: p.quality,
      status: p.status,
      terms: p.terms,
      extra: dueBadge(p.date, p.terms, p.status)
    })),
  ].sort((a,b) => new Date(a.date) - new Date(b.date));

  document.getElementById("detailModalTitle").textContent = `ITEM DETAILS — ${itemName.toUpperCase()}`;

  const body = document.getElementById("detailModalBody");
  body.innerHTML = `
    <div class="detail-modal-title">${baseName}</div>
    <div class="detail-modal-sub">${fabric}${width ? " · Width: " + width : ""}</div>

    <div class="item-stats-row">
      <div class="item-stat-card">
        <div class="item-stat-label">Purchased (m)</div>
        <div class="item-stat-value teal">${fmtNum(totalBought)}m</div>
      </div>
      <div class="item-stat-card">
        <div class="item-stat-label">Sold (m)</div>
        <div class="item-stat-value blue">${fmtNum(totalSoldM)}m</div>
      </div>
      <div class="item-stat-card">
        <div class="item-stat-label">Stock Left (m)</div>
        <div class="item-stat-value ${stockLeft <= 0 ? "neg" : stockLeft < 50 ? "" : "pos"}">${fmtNum(stockLeft)}m</div>
      </div>
      <div class="item-stat-card">
        <div class="item-stat-label">Total Revenue</div>
        <div class="item-stat-value pos">${fmt(totalRevenue)}</div>
      </div>
      <div class="item-stat-card">
        <div class="item-stat-label">Total Cost</div>
        <div class="item-stat-value neg">${fmt(totalCost)}</div>
      </div>
      <div class="item-stat-card">
        <div class="item-stat-label">Net Margin</div>
        <div class="item-stat-value ${margin >= 0 ? "pos" : "neg"}">${fmt(margin)}</div>
      </div>
    </div>

    <div class="item-timeline">
      <div class="timeline-label">TRANSACTION HISTORY (${timeline.length} entries)</div>
      ${timeline.length === 0
        ? `<div class="timeline-empty">No transactions found for this item.</div>`
        : timeline.map((e, idx) => `
          <div class="timeline-entry">
            <div class="timeline-dot-col">
              <div class="timeline-dot ${e.type}"></div>
              ${idx < timeline.length - 1 ? '<div class="timeline-line"></div>' : ''}
            </div>
            <div class="timeline-content">
              <span class="timeline-type-badge ${e.type}">${e.type === "sale" ? "SALE" : "PURCHASE"}</span>
              <div class="timeline-main">${e.party}</div>
              <div class="timeline-meta">
                ${formatDate(e.date)}
                &nbsp;·&nbsp; ${fmtNum(e.meters)}m @ ${fmt(e.ppm)}/m
                ${e.quality ? " &nbsp;·&nbsp; " + e.quality : ""}
                ${e.terms ? " &nbsp;·&nbsp; " + e.terms + "d terms" : ""}
                &nbsp;·&nbsp; ${e.extra}
                ${e.status ? " &nbsp;·&nbsp; " + e.status : ""}
              </div>
            </div>
            <div class="timeline-amount ${e.type}">${e.type === "sale" ? "+" : "−"}${fmt(e.amount)}</div>
          </div>
        `).join("")
      }
    </div>
  `;

  document.getElementById("itemDetailModal").classList.add("open");
}

function renderFabricDetailModal(fabricName) {
  const fabricSales     = sales.filter(s => s.fabric === fabricName);
  const fabricPurchases = purchases.filter(p => p.fabric === fabricName);

  const totalBought  = totalOf(fabricPurchases, "meters");
  const totalSoldM   = totalOf(fabricSales, "meters");
  const stockLeft    = totalBought - totalSoldM;
  const totalRevenue = totalOf(fabricSales);
  const totalCost    = totalOf(fabricPurchases);
  const margin       = totalRevenue - totalCost;

  // Group by item
  const allItems = [...new Set([
    ...fabricSales.map(s => s.item),
    ...fabricPurchases.map(p => p.item),
  ].filter(Boolean))];

  const timeline = [
    ...fabricSales.map(s => ({ date:s.date, type:"sale", party:s.customer, item:s.item, meters:s.meters, ppm:s.ppm, amount:s.amount, terms:s.terms, extra:dueBadge(s.date, s.terms, null) })),
    ...fabricPurchases.map(p => ({ date:p.date, type:"purchase", party:p.supplier, item:p.item, meters:p.meters, ppm:p.ppm, amount:p.amount, quality:p.quality, status:p.status, terms:p.terms, extra:dueBadge(p.date, p.terms, p.status) })),
  ].sort((a,b) => new Date(a.date) - new Date(b.date));

  document.getElementById("detailModalTitle").textContent = `FABRIC DETAILS — ${fabricName.toUpperCase()}`;

  const body = document.getElementById("detailModalBody");
  body.innerHTML = `
    <div class="detail-modal-title">${fabricName} Fabric</div>
    <div class="detail-modal-sub">${allItems.length} distinct item(s) on record</div>

    <div class="item-stats-row">
      <div class="item-stat-card">
        <div class="item-stat-label">Purchased (m)</div>
        <div class="item-stat-value teal">${fmtNum(totalBought)}m</div>
      </div>
      <div class="item-stat-card">
        <div class="item-stat-label">Sold (m)</div>
        <div class="item-stat-value blue">${fmtNum(totalSoldM)}m</div>
      </div>
      <div class="item-stat-card">
        <div class="item-stat-label">Stock Left (m)</div>
        <div class="item-stat-value ${stockLeft <= 0 ? "neg" : "pos"}">${fmtNum(stockLeft)}m</div>
      </div>
      <div class="item-stat-card">
        <div class="item-stat-label">Total Revenue</div>
        <div class="item-stat-value pos">${fmt(totalRevenue)}</div>
      </div>
      <div class="item-stat-card">
        <div class="item-stat-label">Total Cost</div>
        <div class="item-stat-value neg">${fmt(totalCost)}</div>
      </div>
      <div class="item-stat-card">
        <div class="item-stat-label">Net Margin</div>
        <div class="item-stat-value ${margin >= 0 ? "pos" : "neg"}">${fmt(margin)}</div>
      </div>
    </div>

    <div class="item-timeline">
      <div class="timeline-label">FULL HISTORY — ${fabricName.toUpperCase()} (${timeline.length} entries)</div>
      ${timeline.length === 0
        ? `<div class="timeline-empty">No transactions found for ${fabricName}.</div>`
        : timeline.map((e, idx) => `
          <div class="timeline-entry">
            <div class="timeline-dot-col">
              <div class="timeline-dot ${e.type}"></div>
              ${idx < timeline.length - 1 ? '<div class="timeline-line"></div>' : ''}
            </div>
            <div class="timeline-content">
              <span class="timeline-type-badge ${e.type}">${e.type === "sale" ? "SALE" : "PURCHASE"}</span>
              <div class="timeline-main">${e.party}</div>
              <div class="timeline-meta">
                ${formatDate(e.date)}
                &nbsp;·&nbsp; <em>${e.item || fabricName}</em>
                &nbsp;·&nbsp; ${fmtNum(e.meters)}m @ ${fmt(e.ppm)}/m
                ${e.quality ? " &nbsp;·&nbsp; " + e.quality : ""}
                ${e.terms ? " &nbsp;·&nbsp; " + e.terms + "d terms" : ""}
                &nbsp;·&nbsp; ${e.extra}
              </div>
            </div>
            <div class="timeline-amount ${e.type}">${e.type === "sale" ? "+" : "−"}${fmt(e.amount)}</div>
          </div>
        `).join("")
      }
    </div>
  `;

  document.getElementById("itemDetailModal").classList.add("open");
}

function closeItemDetail() {
  document.getElementById("itemDetailModal").classList.remove("open");
}

// Close on backdrop click
document.addEventListener("click", function(e) {
  const modal = document.getElementById("itemDetailModal");
  if (e.target === modal) closeItemDetail();
});

// ============================================
// GENERAL LEDGER
// ============================================
function buildLedgerEntries() {
  const entries = [];
  sales.forEach(s     => entries.push({ date:s.date, name:s.customer,  description:"Sale: "+(s.item||s.fabric),     type:"Sale",     debit:0,        credit:s.amount }));
  purchases.forEach(p => entries.push({ date:p.date, name:p.supplier,  description:"Purchase: "+(p.item||p.fabric), type:"Purchase", debit:p.amount, credit:0 }));
  payments.forEach(p  => entries.push({ date:p.date, name:p.payTo,     description:"Payment: "+p.purpose,           type:"Payment",  debit:p.amount, credit:0 }));
  receipts.forEach(r  => entries.push({ date:r.date, name:r.from,      description:"Receipt: "+(r.purpose||"Cash Receipt"), type:"Receipt", debit:0, credit:r.amount }));
  return entries;
}

function renderLedger() {
  const sortVal = document.getElementById("ledgerSortField")?.value || "date-asc";
  let entries = buildLedgerEntries();
  if (sortVal === "date-desc") entries.sort((a,b)=>new Date(b.date)-new Date(a.date));
  else if (sortVal === "name-asc") entries.sort((a,b)=>a.name.localeCompare(b.name));
  else entries.sort((a,b)=>new Date(a.date)-new Date(b.date));

  document.getElementById("ledgerCount").textContent = entries.length + " entries";
  const tbody = document.querySelector("#ledgerTable tbody");

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
    const cls = balance >= 0 ? "col-credit" : "col-debit";
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
      </tr>`;
  }).join("");

  const net = totalCredit - totalDebit;
  document.getElementById("ledgerSummary").innerHTML = `
    <div class="ledger-summary-card"><div class="ledger-summary-label">Total Debit</div><div class="ledger-summary-value col-debit">${fmt(totalDebit)}</div></div>
    <div class="ledger-summary-card"><div class="ledger-summary-label">Total Credit</div><div class="ledger-summary-value col-credit">${fmt(totalCredit)}</div></div>
    <div class="ledger-summary-card"><div class="ledger-summary-label">Net Balance</div><div class="ledger-summary-value ${net>=0?"col-credit":"col-debit"}">${fmt(net)}</div></div>
  `;
}

// ============================================
// PARTY LEDGER
// ============================================
function getAllParties() {
  const customers  = sales.map(s => ({ name: s.customer, type: "Customer" }));
  const suppliers  = purchases.map(p => ({ name: p.supplier, type: "Supplier" }));
  const payees     = payments.map(p => ({ name: p.payTo, type: "Payee" }));
  const payers     = receipts.map(r => ({ name: r.from, type: "Customer" }));
  const all = [...customers, ...suppliers, ...payees, ...payers];
  const seen = new Set();
  return all.filter(p => { if (seen.has(p.name)) return false; seen.add(p.name); return true; })
            .sort((a,b) => a.name.localeCompare(b.name));
}

function initPartyLedger() {
  const parties = getAllParties();
  const sel = document.getElementById("partySelect");
  const current = sel.value;
  sel.innerHTML = `<option value="">-- Select a Party --</option>` +
    parties.map(p => `<option value="${p.name}">${p.name} (${p.type})</option>`).join("");
  if (current) sel.value = current;
  document.getElementById("partyTypePills").innerHTML = "";
  renderPartyLedger();
}

function renderPartyLedger() {
  const party = document.getElementById("partySelect").value;
  const container = document.getElementById("partyLedgerContent");
  if (!party) {
    container.innerHTML = `<div class="empty-state">Select a party above to view their individual ledger</div>`;
    return;
  }

  const entries = [];
  sales.filter(s=>s.customer===party).forEach(s =>
    entries.push({ date:s.date, description:"Sale: "+(s.item||s.fabric), type:"Sale", debit:0, credit:s.amount }));
  purchases.filter(p=>p.supplier===party).forEach(p =>
    entries.push({ date:p.date, description:"Purchase: "+(p.item||p.fabric), type:"Purchase", debit:p.amount, credit:0 }));
  payments.filter(p=>p.payTo===party).forEach(p =>
    entries.push({ date:p.date, description:"Payment: "+p.purpose, type:"Payment", debit:p.amount, credit:0 }));
  receipts.filter(r=>r.from===party).forEach(r =>
    entries.push({ date:r.date, description:"Receipt: "+(r.purpose||"Cash Receipt"), type:"Receipt", debit:0, credit:r.amount }));

  entries.sort((a,b) => new Date(a.date) - new Date(b.date));

  if (!entries.length) {
    container.innerHTML = `<div class="empty-state">No transactions found for "${party}"</div>`;
    return;
  }

  let totalDebit = 0, totalCredit = 0, balance = 0;
  const rows = entries.map((e, i) => {
    totalDebit  += e.debit;
    totalCredit += e.credit;
    balance     += (e.credit - e.debit);
    const cls = balance >= 0 ? "col-credit" : "col-debit";
    return `<tr>
      <td>${i+1}</td>
      <td>${formatDate(e.date)}</td>
      <td>${e.description}</td>
      <td>${typeBadge(e.type)}</td>
      <td class="amount-cell col-debit">${e.debit  ? fmt(e.debit)  : "—"}</td>
      <td class="amount-cell col-credit">${e.credit ? fmt(e.credit) : "—"}</td>
      <td class="amount-cell ${cls}">${fmt(balance)}</td>
    </tr>`;
  }).join("");

  const net = totalCredit - totalDebit;
  const netLabel = net > 0 ? "We Owe (Payable)" : net < 0 ? "They Owe (Receivable)" : "Settled";
  const netCls = net >= 0 ? "col-credit" : "col-debit";

  container.innerHTML = `
    <div class="party-ledger-header">
      <h2 class="party-name-title">${party}</h2>
    </div>
    <div class="ledger-summary" style="margin-bottom:20px">
      <div class="ledger-summary-card"><div class="ledger-summary-label">Total Debit (Our Cost)</div><div class="ledger-summary-value col-debit">${fmt(totalDebit)}</div></div>
      <div class="ledger-summary-card"><div class="ledger-summary-label">Total Credit (Our Income)</div><div class="ledger-summary-value col-credit">${fmt(totalCredit)}</div></div>
      <div class="ledger-summary-card"><div class="ledger-summary-label">Net — ${netLabel}</div><div class="ledger-summary-value ${netCls}">${fmt(Math.abs(net))}</div></div>
    </div>
    <div class="table-card">
      <div class="table-card-header"><span>LEDGER — ${party.toUpperCase()}</span><span class="table-count">${entries.length} entries</span></div>
      <div class="table-scroll">
        <table class="data-table">
          <thead><tr><th>#</th><th>Date</th><th>Description</th><th>Type</th><th class="col-debit">Debit</th><th class="col-credit">Credit</th><th>Balance</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================
// TRIAL BALANCE
// ============================================
function renderTrialBalance() {
  const totalSalesAmt    = totalOf(sales);
  const totalPurchAmt    = totalOf(purchases);
  const totalReceiptsAmt = totalOf(receipts);
  const totalPaymentsAmt = totalOf(payments);

  const unpaidSales = totalOf(sales.filter(s=> {
    // Check if terms overdue: no explicit "paid" on sales, check receipts
    const rec = totalOf(receipts.filter(r => r.from === s.customer));
    return rec < s.amount;
  }));
  const paidPurch   = totalOf(purchases.filter(p=>p.status==="Paid"));
  const unpaidPurch = totalOf(purchases.filter(p=>p.status==="Unpaid"||p.status==="Partial"));
  const cashBalance = totalReceiptsAmt - totalPaymentsAmt;

  const trialAccounts = [
    { name: "Sales Revenue",         type: "Revenue",   dr: 0,            cr: totalSalesAmt },
    { name: "Accounts Receivable",   type: "Asset",     dr: unpaidSales,  cr: 0 },
    { name: "Cash Received",         type: "Asset",     dr: totalReceiptsAmt, cr: 0 },
    { name: "Cost of Purchases",     type: "Expense",   dr: totalPurchAmt, cr: 0 },
    { name: "Accounts Payable",      type: "Liability", dr: 0,            cr: unpaidPurch },
    { name: "Cash Paid to Suppliers/Expenses", type: "Expense", dr: totalPaymentsAmt, cr: 0 },
    { name: "Capital / Equity",      type: "Equity",    dr: 0,            cr: Math.max(totalSalesAmt + totalReceiptsAmt - totalPurchAmt - totalPaymentsAmt, 0) },
  ].filter(a => a.dr !== 0 || a.cr !== 0);

  const totalDr = trialAccounts.reduce((s,a) => s + a.dr, 0);
  const totalCr = trialAccounts.reduce((s,a) => s + a.cr, 0);
  const balanced = Math.abs(totalDr - totalCr) < 1;

  const typeColor = { Asset:"var(--blue-bright)", Liability:"var(--yellow)", Revenue:"var(--green)", Expense:"var(--red)", Equity:"var(--purple)" };

  const rows = trialAccounts.map(a => `
    <tr>
      <td>${a.name}</td>
      <td style="color:${typeColor[a.type]||"var(--text-primary)"}">${a.type}</td>
      <td class="amount-cell col-debit">${a.dr ? fmt(a.dr) : "—"}</td>
      <td class="amount-cell col-credit">${a.cr ? fmt(a.cr) : "—"}</td>
    </tr>
  `).join("");

  document.getElementById("trialBalanceContent").innerHTML = `
    <div class="ledger-summary" style="margin-bottom:20px">
      <div class="ledger-summary-card"><div class="ledger-summary-label">Total Debits</div><div class="ledger-summary-value col-debit">${fmt(totalDr)}</div></div>
      <div class="ledger-summary-card"><div class="ledger-summary-label">Total Credits</div><div class="ledger-summary-value col-credit">${fmt(totalCr)}</div></div>
      <div class="ledger-summary-card">
        <div class="ledger-summary-label">Status</div>
        <div class="ledger-summary-value" style="color:${balanced?"var(--green)":"var(--red)"}">
          ${balanced ? "✓ BALANCED" : "✗ UNBALANCED (Δ " + fmt(Math.abs(totalDr-totalCr)) + ")"}
        </div>
      </div>
    </div>
    <div class="table-card">
      <div class="table-card-header"><span>TRIAL BALANCE</span><span class="table-count">${trialAccounts.length} accounts</span></div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr><th>Account Name</th><th>Type</th><th class="col-debit">Debit (PKR)</th><th class="col-credit">Credit (PKR)</th></tr>
          </thead>
          <tbody>
            ${rows}
            <tr style="border-top:2px solid var(--border-light);font-weight:700;background:var(--bg-card-alt)">
              <td colspan="2" style="font-family:var(--font-mono);font-size:11px;letter-spacing:0.08em">TOTAL</td>
              <td class="amount-cell col-debit">${fmt(totalDr)}</td>
              <td class="amount-cell col-credit">${fmt(totalCr)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="tb-note">
      <strong>Note:</strong> This trial balance uses a simplified cash-basis accounting model.
      Inventory is tracked separately in the Inventory section.
      For full GAAP compliance, consult a professional accountant.
    </div>
  `;
}

// ============================================
// INVENTORY
// ============================================
function renderInventory() {
  const allFabrics = [...new Set([...sales.map(s=>s.fabric), ...purchases.map(p=>p.fabric)].filter(Boolean))].sort();

  if (!allFabrics.length) {
    document.getElementById("inventoryGrid").innerHTML = `<div class="fib-card"><div class="fib-label">No inventory data yet.</div></div>`;
    document.querySelector("#inventoryTable tbody").innerHTML = `<tr class="empty-row"><td colspan="9">No data available.</td></tr>`;
    return;
  }

  const rows = allFabrics.map(fabric => {
    const sRows  = sales.filter(s => s.fabric === fabric);
    const pRows  = purchases.filter(p => p.fabric === fabric);
    const sold   = totalOf(sRows, "meters");
    const bought = totalOf(pRows, "meters");
    const stock  = bought - sold;
    const sellAmt= totalOf(sRows);
    const buyAmt = totalOf(pRows);
    const buyAvg = bought ? (buyAmt / bought) : 0;
    const sellAvg= sold   ? (sellAmt / sold)  : 0;
    const margin = sellAvg - buyAvg;
    const pct    = bought ? Math.min(100, Math.round((Math.max(stock,0) / bought) * 100)) : 0;
    const stockStatus  = stock <= 0 ? "OUT OF STOCK" : pct < 20 ? "LOW STOCK" : "IN STOCK";
    const stockBadgeCls= stock <= 0 ? "badge-outstock" : pct < 20 ? "badge-lowstock" : "badge-instock";
    const barCls = stock <= 0 ? "out" : pct < 20 ? "low" : "ok";
    return { fabric, sold, bought, stock, buyAvg, sellAvg, margin, pct, stockStatus, stockBadgeCls, barCls };
  });

  document.getElementById("inventoryGrid").innerHTML = rows.map(r => `
    <div class="inv-card" onclick="openFabricDetail('${r.fabric}')">
      <div class="inv-fabric-name">${r.fabric}</div>
      <div class="inv-stat"><span class="inv-stat-label">PURCHASED</span><span class="inv-stat-value">${fmtNum(r.bought)}m</span></div>
      <div class="inv-stat"><span class="inv-stat-label">SOLD</span><span class="inv-stat-value" style="color:var(--blue-bright)">${fmtNum(r.sold)}m</span></div>
      <div class="inv-stat"><span class="inv-stat-label">STOCK LEFT</span><span class="inv-stat-value" style="color:${r.stock<=0?"var(--red)":r.pct<20?"var(--yellow)":"var(--green)"}">${fmtNum(r.stock)}m</span></div>
      <div class="inv-bar-track"><div class="inv-bar-fill ${r.barCls}" style="width:${r.pct}%"></div></div>
    </div>
  `).join("");

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
      <td><button class="btn-detail" onclick="openFabricDetail('${r.fabric}')">◉ Details</button></td>
    </tr>
  `).join("");
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
  const totalMetersSold= totalOf(sales, "meters");
  const profitPerMeter = totalMetersSold ? (netProfit / totalMetersSold) : 0;
  const paidSales      = totalOf(sales.filter(s=>s.status==="Paid"));
  const unpaidSales    = totalOf(sales.filter(s=>s.status==="Unpaid"));

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
    <div class="is-row"><span class="is-label">  — Received</span><span class="is-value">${fmt(totalReceipts)}</span></div>
    <div class="is-row"><span class="is-label">  — Outstanding</span><span class="is-value">${fmt(Math.max(0, totalSales - totalReceipts))}</span></div>
    <div class="is-row"><span class="is-label">Less: Purchases</span><span class="is-value negative">− ${fmt(totalPurchases)}</span></div>
    <div class="is-row"><span class="is-label">Gross Profit</span><span class="is-value ${grossProfit>=0?"positive":"negative"}">${fmt(grossProfit)}</span></div>
    <div class="is-row"><span class="is-label">Less: Expenses</span><span class="is-value negative">− ${fmt(totalPayments)}</span></div>
    <div class="is-row total-row">
      <span class="is-label" style="font-weight:700;color:var(--text-primary)">NET PROFIT / (LOSS)</span>
      <span class="is-value ${netProfit>=0?"positive":"negative"}" style="font-size:15px">${fmt(netProfit)}</span>
    </div>
  `;

  const maxCF  = Math.max(totalReceipts, totalPayments, 1);
  const recPct = Math.round((totalReceipts / maxCF) * 100);
  const payPct = Math.round((totalPayments / maxCF) * 100);
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
  if (!months.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No data available.</td></tr>`; return; }
  tbody.innerHTML = months.map(ym => {
    const mS  = totalOf(sales.filter(x=>x.date.startsWith(ym)));
    const mP  = totalOf(purchases.filter(x=>x.date.startsWith(ym)));
    const mR  = totalOf(receipts.filter(x=>x.date.startsWith(ym)));
    const mPy = totalOf(payments.filter(x=>x.date.startsWith(ym)));
    const mN  = mS - mP - mPy;
    const label = new Date(ym+"-01").toLocaleDateString("en-GB",{month:"short",year:"numeric"});
    return `<tr>
      <td><strong>${label}</strong></td>
      <td class="amount-cell" style="color:var(--blue-bright)">${fmt(mS)}</td>
      <td class="amount-cell" style="color:var(--yellow)">${fmt(mP)}</td>
      <td class="amount-cell" style="color:var(--green)">${fmt(mR)}</td>
      <td class="amount-cell" style="color:var(--red)">${fmt(mPy)}</td>
      <td class="amount-cell" style="color:${mN>=0?"var(--green)":"var(--red)"};font-weight:700">${fmt(mN)}</td>
    </tr>`;
  }).join("");
}

// ============================================
// INVOICE
// ============================================
function openInvoice(saleId) {
  const sale = sales.find(s => s.id === saleId);
  if (!sale) return;

  const invNum = "INV-" + String(saleId).padStart(4, "0");
  const now = new Date();
  const printDate = now.toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" });

  let itemName = sale.item || sale.fabric || "Fabric";
  let width = "";
  if (sale.item && sale.item.includes("/")) {
    const parts = sale.item.split("/");
    itemName = parts[0].trim();
    width = parts[1] ? parts[1].trim() : "";
  }

  const subtotal = sale.amount;
  const numToWords = (n) => {
    const a = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
    const b = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
    const small = (n) => {
      let s = "";
      if (n >= 100) { s += a[Math.floor(n/100)] + " hundred "; n %= 100; }
      if (n >= 20)  { s += b[Math.floor(n/10)] + " "; n %= 10; }
      if (n > 0)    { s += a[n] + " "; }
      return s.trim();
    };
    if (n === 0) return "Zero";
    let str = "";
    if (n >= 100000) { str += small(Math.floor(n/100000)) + " lakh "; n %= 100000; }
    if (n >= 1000)   { str += small(Math.floor(n/1000))   + " thousand "; n %= 1000; }
    return (str + small(n)).trim().replace(/\b\w/g, c => c.toUpperCase());
  };

  const amtWords = numToWords(Math.round(subtotal));
  const termsLine = sale.terms ? `${sale.terms} days (Due: ${dueText(sale.date, sale.terms)})` : "On Receipt";

  document.getElementById("invoicePrintArea").innerHTML = `
    <div class="invoice-doc" id="invoiceDoc">
      <div class="inv-header">
        <div class="inv-brand-block">
          <div class="inv-brand-name">▣ ZAHID FABRIC</div>
          <div class="inv-brand-tagline">Wholesale Fabric Suppliers — Karachi, Pakistan</div>
          <div class="inv-brand-contact">📞 +92-XXX-XXXXXXX &nbsp;|&nbsp; ✉ info@zahidfabric.pk</div>
        </div>
        <div class="inv-meta-block">
          <div class="inv-title-tag">SALES INVOICE</div>
          <table class="inv-meta-table">
            <tr><td>Invoice No.</td><td><strong>${invNum}</strong></td></tr>
            <tr><td>Invoice Date</td><td>${formatDate(sale.date)}</td></tr>
            <tr><td>Payment Terms</td><td>${termsLine}</td></tr>
            <tr><td>Print Date</td><td>${printDate}</td></tr>
          </table>
        </div>
      </div>
      <div class="inv-divider"></div>
      <div class="inv-parties">
        <div class="inv-party-block">
          <div class="inv-party-label">BILL TO</div>
          <div class="inv-party-name">${sale.customer}</div>
        </div>
        <div class="inv-party-block">
          <div class="inv-party-label">FABRIC TYPE</div>
          <div class="inv-party-name">${sale.fabric}</div>
          ${width ? `<div class="inv-party-sub">Width: ${width}</div>` : ""}
        </div>
      </div>
      <table class="inv-items-table">
        <thead>
          <tr>
            <th>#</th><th>Description</th><th>Fabric</th><th>Width</th>
            <th style="text-align:right">Meters (m)</th>
            <th style="text-align:right">Rate/m (PKR)</th>
            <th style="text-align:right">Amount (PKR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>${itemName}</td>
            <td>${sale.fabric}</td>
            <td>${width || "—"}</td>
            <td style="text-align:right">${fmtNum(sale.meters)}</td>
            <td style="text-align:right">${fmtRaw(sale.ppm)}</td>
            <td style="text-align:right"><strong>${fmtRaw(subtotal)}</strong></td>
          </tr>
        </tbody>
      </table>
      <div class="inv-totals-block">
        <div class="inv-words-block">
          <span class="inv-words-label">Amount in Words:</span>
          <span class="inv-words-value">PKR ${amtWords} Only</span>
        </div>
        <div class="inv-total-rows">
          <div class="inv-total-row"><span>Sub Total</span><span>Rs ${fmtRaw(subtotal)}</span></div>
          <div class="inv-total-row inv-grand-total"><span>TOTAL PAYABLE</span><span>Rs ${fmtRaw(subtotal)}</span></div>
        </div>
      </div>
      <div class="inv-divider"></div>
      <div class="inv-footer">
        <div class="inv-footer-terms">
          <div class="inv-footer-label">TERMS & CONDITIONS</div>
          <ul>
            <li>Payment due within ${sale.terms || 30} days of invoice date.</li>
            <li>Goods once sold are not returnable unless defective.</li>
            <li>Disputes subject to Karachi jurisdiction.</li>
          </ul>
        </div>
        <div class="inv-sig-block">
          <div class="inv-sig-line"></div>
          <div class="inv-sig-label">Authorised Signature</div>
          <div class="inv-sig-name">Zahid Fabric</div>
        </div>
      </div>
      <div class="inv-stamp-note">This is a computer-generated invoice and does not require a physical signature unless stamped.</div>
    </div>
  `;

  document.getElementById("invoiceModal").style.display = "flex";
  document.getElementById("invoiceModal").dataset.saleId = saleId;
}

function closeInvoiceModal(e) {
  if (e.target === document.getElementById("invoiceModal")) {
    document.getElementById("invoiceModal").style.display = "none";
  }
}

function printInvoice() {
  const content = document.getElementById("invoiceDoc").outerHTML;
  const win = window.open("", "_blank");
  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8"/>
    <title>Invoice</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <style>${getInvoiceStyles()}
    @media print { body { margin:0; } .invoice-doc { box-shadow:none; } }
    </style>
  </head><body>${content}<script>window.onload=()=>{window.print();window.close();}<\/script></body></html>`);
  win.document.close();
}

function downloadInvoice() {
  const saleId = parseInt(document.getElementById("invoiceModal").dataset.saleId);
  const sale = sales.find(s => s.id === saleId);
  const invNum = "INV-" + String(saleId).padStart(4, "0");
  const content = document.getElementById("invoiceDoc").outerHTML;
  const fullHtml = `<!DOCTYPE html><html><head>
    <meta charset="UTF-8"/>
    <title>${invNum} — Zahid Fabric</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <style>${getInvoiceStyles()}</style>
  </head><body style="background:#f5f5f5;padding:30px">${content}</body></html>`;
  const blob = new Blob([fullHtml], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${invNum}-${(sale?.customer||"invoice").replace(/[^a-z0-9]/gi,"_")}.html`;
  a.click();
  showToast("Invoice downloaded as HTML file.", "success");
}

function getInvoiceStyles() {
  return `
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'IBM Plex Sans',sans-serif; font-size:13px; color:#1a1a2e; }
    .invoice-doc { background:#fff; max-width:800px; margin:0 auto; padding:40px; box-shadow:0 4px 24px rgba(0,0,0,0.15); }
    .inv-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
    .inv-brand-name { font-family:'IBM Plex Mono',monospace; font-size:22px; font-weight:700; color:#1e3a8a; margin-bottom:4px; }
    .inv-brand-tagline { font-size:12px; color:#555; margin-bottom:4px; }
    .inv-brand-contact { font-size:11px; color:#777; }
    .inv-meta-block { text-align:right; }
    .inv-title-tag { font-family:'IBM Plex Mono',monospace; font-size:14px; font-weight:700; color:#2563eb; letter-spacing:0.1em; margin-bottom:12px; }
    .inv-meta-table { font-size:12px; border-collapse:collapse; margin-left:auto; }
    .inv-meta-table td { padding:3px 8px; color:#444; }
    .inv-meta-table td:first-child { color:#888; text-align:right; }
    .inv-divider { height:2px; background:linear-gradient(90deg,#1e3a8a,#2563eb,#60a5fa); margin:20px 0; }
    .inv-parties { display:flex; gap:40px; margin-bottom:24px; }
    .inv-party-label { font-family:'IBM Plex Mono',monospace; font-size:9px; font-weight:600; letter-spacing:0.12em; color:#888; text-transform:uppercase; margin-bottom:6px; }
    .inv-party-name { font-size:16px; font-weight:700; color:#1a1a2e; }
    .inv-party-sub { font-size:12px; color:#666; margin-top:2px; }
    .inv-items-table { width:100%; border-collapse:collapse; margin-bottom:20px; }
    .inv-items-table th { background:#1e3a8a; color:#fff; padding:9px 12px; font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:600; letter-spacing:0.08em; text-align:left; }
    .inv-items-table td { padding:10px 12px; border-bottom:1px solid #e5e7eb; font-size:13px; }
    .inv-items-table tbody tr:hover { background:#f8faff; }
    .inv-totals-block { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
    .inv-words-block { max-width:55%; }
    .inv-words-label { font-size:10px; color:#888; font-family:'IBM Plex Mono',monospace; display:block; margin-bottom:4px; }
    .inv-words-value { font-size:12px; color:#1a1a2e; font-style:italic; }
    .inv-total-rows { min-width:260px; }
    .inv-total-row { display:flex; justify-content:space-between; padding:6px 0; font-size:13px; border-bottom:1px solid #e5e7eb; }
    .inv-grand-total { font-weight:700; font-size:15px; color:#1e3a8a; border-top:2px solid #1e3a8a; border-bottom:none; padding-top:10px; margin-top:4px; }
    .inv-footer { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:16px; }
    .inv-footer-label { font-family:'IBM Plex Mono',monospace; font-size:9px; font-weight:600; letter-spacing:0.1em; color:#888; margin-bottom:6px; text-transform:uppercase; }
    .inv-footer-terms ul { list-style:none; padding:0; }
    .inv-footer-terms ul li { font-size:11px; color:#666; margin-bottom:3px; padding-left:12px; position:relative; }
    .inv-footer-terms ul li::before { content:"•"; position:absolute; left:0; color:#2563eb; }
    .inv-sig-block { text-align:center; min-width:160px; }
    .inv-sig-line { height:1px; background:#1a1a2e; margin-bottom:6px; }
    .inv-sig-label { font-size:10px; color:#888; font-family:'IBM Plex Mono',monospace; }
    .inv-sig-name { font-size:12px; font-weight:600; color:#1a1a2e; }
    .inv-stamp-note { font-size:10px; color:#aaa; text-align:center; font-style:italic; margin-top:8px; }
    .badge { display:inline-block; padding:2px 8px; font-family:'IBM Plex Mono',monospace; font-size:9px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; border:1px solid; }
    .badge-paid { color:#16a34a; border-color:#16a34a; }
    .badge-unpaid { color:#dc2626; border-color:#dc2626; }
    .badge-partial { color:#d97706; border-color:#d97706; }
  `;
}

// ============================================
// CLEAR FORMS
// ============================================
function clearForm(type) {
  const map = {
    sale:     ["saleCustomer","saleItem","saleMeters","salePricePerMeter","saleAmount","saleDate","saleTerms"],
    purchase: ["purchaseSupplier","purchaseItem","purchaseMeters","purchasePricePerMeter","purchaseAmount","purchaseDate","purchaseTerms"],
    payment:  ["paymentTo","paymentAmount","paymentPurpose","paymentDate"],
    receipt:  ["receiptFrom","receiptAmount","receiptPurpose","receiptDate"],
  };
  (map[type]||[]).forEach(id => { const el=document.getElementById(id); if(el) el.value=""; });
  // Reset selects to first option
  if (type === "sale") document.getElementById("saleFabric").value = "";
  if (type === "purchase") { document.getElementById("purchaseFabric").value = ""; document.getElementById("purchaseStatus").value = "Unpaid"; }
}

// ============================================
// SIDEBAR
// ============================================
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarOverlay")?.classList.remove("active");
}

function updateDate() {
  const el = document.getElementById("topbarDate");
  if (el) el.textContent = new Date().toLocaleDateString("en-GB",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});
}

// ============================================
// INIT
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

  // Default payment terms
  const sTerms = document.getElementById("saleTerms");
  const pTerms = document.getElementById("purchaseTerms");
  if (sTerms && !sTerms.value) sTerms.value = "30";
  if (pTerms && !pTerms.value) pTerms.value = "30";

  updateDate();
  setInterval(updateDate, 60000);
  switchSection("dashboard");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginPassword").focus();
});