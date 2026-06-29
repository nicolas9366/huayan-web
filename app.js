// Global state
let currentWorkbook = null;
let currentSheetName = null;
let rawData = []; // Full parsed JSON array for the current sheet
let filteredData = []; // Data after filters and search
let tablePage = 1;
const rowsPerPage = 10;
let sortColumn = null;
let sortAscending = true;

// UI Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const tabContainer = document.getElementById('tabs-container');
const dashboardContent = document.getElementById('dashboard-content');
const loadDemoBtn = document.getElementById('load-demo');
const uploadBtn = document.getElementById('upload-btn');
const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('search-input');
const repFilter = document.getElementById('rep-filter');
const regionFilter = document.getElementById('region-filter');
const categoryFilter = document.getElementById('category-filter');
const paginationInfo = document.getElementById('pagination-info');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');

// Charts references
let salesTrendChart = null;
let productPerformanceChart = null;
let categoryShareChart = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Drag and drop events
  window.addEventListener('dragenter', handleDragEnter);
  window.addEventListener('dragover', handleDragOver);
  window.addEventListener('dragleave', handleDragLeave);
  window.addEventListener('drop', handleDrop);

  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelect);

  loadDemoBtn.addEventListener('click', loadDemoData);
  uploadBtn.addEventListener('click', () => fileInput.click());

  // Table events
  searchInput.addEventListener('input', applyFilters);
  repFilter.addEventListener('change', applyFilters);
  regionFilter.addEventListener('change', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  prevPageBtn.addEventListener('click', () => changePage(-1));
  nextPageBtn.addEventListener('click', () => changePage(1));
});

// Drag and Drop Management
let dragCounter = 0;
const dragOverlay = document.getElementById('drag-overlay');

function handleDragEnter(e) {
  e.preventDefault();
  dragCounter++;
  if (dragCounter === 1) {
    dragOverlay.style.display = 'flex';
  }
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDragLeave(e) {
  e.preventDefault();
  dragCounter--;
  if (dragCounter === 0) {
    dragOverlay.style.display = 'none';
  }
}

function handleDrop(e) {
  e.preventDefault();
  dragCounter = 0;
  dragOverlay.style.display = 'none';

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleFileSelect(e) {
  const files = e.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

// Read and Parse File using SheetJS
function processFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    try {
      const workbook = XLSX.read(data, { type: 'array' });
      currentWorkbook = workbook;
      setupSheetTabs(workbook);
      loadSheet(workbook.SheetNames[0]);
    } catch (err) {
      alert('文件解析失败，请确保上传了正确的 Excel 或 CSV 文件。');
      console.error(err);
    }
  };
  reader.readAsArrayBuffer(file);
}

// Generate tabs for Excel sheets
function setupSheetTabs(workbook) {
  tabContainer.innerHTML = '';
  if (workbook.SheetNames.length <= 1) {
    tabContainer.classList.add('hidden');
    return;
  }
  tabContainer.classList.remove('hidden');

  workbook.SheetNames.forEach((sheetName, index) => {
    const tab = document.createElement('button');
    tab.className = `tab ${index === 0 ? 'active' : ''}`;
    tab.textContent = sheetName;
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadSheet(sheetName);
    });
    tabContainer.appendChild(tab);
  });
}

// Parse sheet to JSON and initialize Dashboard
function loadSheet(sheetName) {
  currentSheetName = sheetName;
  const worksheet = currentWorkbook.Sheets[sheetName];
  // Parse JSON, formatting dates where possible
  const sheetData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  if (sheetData.length === 0) {
    alert(`工作表 "${sheetName}" 为空。`);
    return;
  }

  processSalesRecords(sheetData);
}

// Load Demo Data for presentation
function loadDemoData() {
  if (window.mockSalesData) {
    tabContainer.classList.add('hidden');
    processSalesRecords(window.mockSalesData);
  } else {
    alert('示例数据加载失败，未找到 mock 数据。');
  }
}

// Core Data processing and mapping logic
function processSalesRecords(dataList) {
  if (dataList.length === 0) return;

  // Auto-detect standard columns
  const firstRecord = dataList[0];
  const keys = Object.keys(firstRecord);

  // Mapping configurations
  const mappings = {
    date: /日期|时间|date|time/i,
    product: /产品|商品|名称|product|item|goods/i,
    category: /类别|分类|类型|category|type/i,
    sales: /金额|销售额|销售金额|价格|额|amount|sales|price|revenue/i,
    quantity: /数量|件数|销量|qty|quantity|count/i,
    rep: /销售员|业务员|销售|销售代表|人员|员工|rep|salesperson|agent/i,
    region: /地区|区域|城市|省份|国家|region|area|city|zone/i
  };

  const detected = {};
  for (const field in mappings) {
    detected[field] = keys.find(key => mappings[field].test(key)) || null;
  }

  // Fallbacks if columns are not found, search by position or typical indices
  if (!detected.date) detected.date = keys.find(key => /date/i.test(key)) || keys[0];
  if (!detected.product) detected.product = keys[1] || null;
  if (!detected.category) detected.category = keys[2] || null;
  if (!detected.sales) detected.sales = keys.find(key => /num|amount|val/i.test(key)) || keys[3];
  if (!detected.quantity) detected.quantity = keys[4] || null;
  if (!detected.rep) detected.rep = keys.find(key => /name|user|peop/i.test(key)) || keys[5];
  if (!detected.region) detected.region = keys[6] || null;

  // Map elements cleanly to standard object fields
  rawData = dataList.map((row, idx) => {
    // Helper to extract numeric value cleanly
    const parseNumeric = (val) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      const cleanStr = String(val).replace(/[^\d.-]/g, '');
      return parseFloat(cleanStr) || 0;
    };

    // Helper for date conversion if SheetJS read date as Serial
    const parseDateStr = (val) => {
      if (!val) return '未知日期';
      if (typeof val === 'number' && val > 30000 && val < 60000) {
        // Excel Serial date
        const dateObj = XLSX.SSF.parse_date_code(val);
        return `${dateObj.y}-${String(dateObj.m).padStart(2, '0')}-${String(dateObj.d).padStart(2, '0')}`;
      }
      if (val instanceof Date) {
        return val.toISOString().split('T')[0];
      }
      return String(val).trim().split(' ')[0] || '未知日期';
    };

    return {
      id: idx + 1,
      date: detected.date ? parseDateStr(row[detected.date]) : 'N/A',
      product: detected.product ? String(row[detected.product]).trim() : '其他商品',
      category: detected.category ? String(row[detected.category]).trim() : '未分类',
      sales: detected.sales ? parseNumeric(row[detected.sales]) : 0,
      quantity: detected.quantity ? parseNumeric(row[detected.quantity]) : 1,
      rep: detected.rep ? String(row[detected.rep]).trim() : '其他人员',
      region: detected.region ? String(row[detected.region]).trim() : '全国'
    };
  });

  // Reveal dashboard and apply filters
  dashboardContent.classList.add('visible');
  document.getElementById('welcome-card').classList.add('hidden');

  populateFilterDropdowns();
  applyFilters();
}

// Populate search filters dynamically from rawData values
function populateFilterDropdowns() {
  const reps = new Set();
  const regions = new Set();
  const categories = new Set();

  rawData.forEach(row => {
    if (row.rep && row.rep !== '其他人员') reps.add(row.rep);
    if (row.region && row.region !== '全国') regions.add(row.region);
    if (row.category && row.category !== '未分类') categories.add(row.category);
  });

  // Rep
  repFilter.innerHTML = '<option value="">所有销售员</option>';
  Array.from(reps).sort().forEach(rep => {
    repFilter.innerHTML += `<option value="${rep}">${rep}</option>`;
  });

  // Region
  regionFilter.innerHTML = '<option value="">所有地区</option>';
  Array.from(regions).sort().forEach(reg => {
    regionFilter.innerHTML += `<option value="${reg}">${reg}</option>`;
  });

  // Category
  categoryFilter.innerHTML = '<option value="">所有类别</option>';
  Array.from(categories).sort().forEach(cat => {
    categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

// Filter, Search, and Sort records
function applyFilters() {
  const searchQuery = searchInput.value.toLowerCase().trim();
  const selectedRep = repFilter.value;
  const selectedRegion = regionFilter.value;
  const selectedCategory = categoryFilter.value;

  filteredData = rawData.filter(row => {
    const matchesSearch = !searchQuery || 
      row.product.toLowerCase().includes(searchQuery) ||
      row.category.toLowerCase().includes(searchQuery) ||
      row.rep.toLowerCase().includes(searchQuery) ||
      row.region.toLowerCase().includes(searchQuery);

    const matchesRep = !selectedRep || row.rep === selectedRep;
    const matchesRegion = !selectedRegion || row.region === selectedRegion;
    const matchesCategory = !selectedCategory || row.category === selectedCategory;

    return matchesSearch && matchesRep && matchesRegion && matchesCategory;
  });

  // Sort if needed
  if (sortColumn) {
    filteredData.sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];
      
      if (typeof valA === 'string') {
        return sortAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return sortAscending ? valA - valB : valB - valA;
      }
    });
  }

  tablePage = 1; // Reset to page 1
  calculateKPIs();
  renderCharts();
  renderTable();
}

// Compute KPI summary cards
function calculateKPIs() {
  const totalSales = filteredData.reduce((sum, r) => sum + r.sales, 0);
  const totalQty = filteredData.reduce((sum, r) => sum + r.quantity, 0);
  const transactions = filteredData.length;
  const avgOrderVal = transactions > 0 ? (totalSales / transactions) : 0;

  // Animate numbers elegantly
  animateNumberValue('total-sales-val', totalSales, true);
  animateNumberValue('total-qty-val', totalQty, false);
  animateNumberValue('transactions-val', transactions, false);
  animateNumberValue('avg-order-val', avgOrderVal, true);
}

// Number count-up animation
function animateNumberValue(id, targetVal, isCurrency) {
  const el = document.getElementById(id);
  if (!el) return;

  const duration = 500; // 0.5s duration
  const start = performance.now();
  const startVal = parseFloat(el.getAttribute('data-val') || '0');
  
  el.setAttribute('data-val', targetVal);

  function updateNumber(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    // EaseOutQuad formula
    const currentVal = startVal + (targetVal - startVal) * progress * (2 - progress);

    if (isCurrency) {
      el.textContent = '¥' + currentVal.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else {
      el.textContent = Math.floor(currentVal).toLocaleString('zh-CN');
    }

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }

  requestAnimationFrame(updateNumber);
}

// Visual Chart Rendering
function renderCharts() {
  // Destroy old charts to prevent duplicate canvases overlapping
  if (salesTrendChart) salesTrendChart.destroy();
  if (productPerformanceChart) productPerformanceChart.destroy();
  if (categoryShareChart) categoryShareChart.destroy();

  // 1. Sales Trend (Line Chart)
  // Aggregate sales by date
  const salesByDate = {};
  filteredData.forEach(row => {
    if (row.date && row.date !== 'N/A') {
      salesByDate[row.date] = (salesByDate[row.date] || 0) + row.sales;
    }
  });

  const sortedDates = Object.keys(salesByDate).sort();
  const trendLabels = sortedDates;
  const trendValues = sortedDates.map(date => salesByDate[date]);

  const ctxTrend = document.getElementById('salesTrendChart').getContext('2d');
  salesTrendChart = new Chart(ctxTrend, {
    type: 'line',
    data: {
      labels: trendLabels,
      datasets: [{
        label: '销售额',
        data: trendValues,
        borderColor: '#cba382',
        backgroundColor: 'rgba(203, 163, 130, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
      }
    }
  });

  // 2. Product Performance (Bar Chart)
  // Aggregate sales by product
  const salesByProduct = {};
  filteredData.forEach(row => {
    salesByProduct[row.product] = (salesByProduct[row.product] || 0) + row.sales;
  });

  const topProducts = Object.keys(salesByProduct)
    .map(prod => ({ name: prod, val: salesByProduct[prod] }))
    .sort((a, b) => b.val - a.val)
    .slice(0, 8); // Top 8 products

  const ctxProduct = document.getElementById('productPerformanceChart').getContext('2d');
  productPerformanceChart = new Chart(ctxProduct, {
    type: 'bar',
    data: {
      labels: topProducts.map(p => p.name),
      datasets: [{
        label: '销售额',
        data: topProducts.map(p => p.val),
        backgroundColor: 'rgba(56, 189, 248, 0.8)',
        borderColor: '#38bdf8',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
      }
    }
  });

  // 3. Category/Representative Share (Doughnut Chart)
  const salesByCategory = {};
  filteredData.forEach(row => {
    salesByCategory[row.category] = (salesByCategory[row.category] || 0) + row.sales;
  });

  const categoryLabels = Object.keys(salesByCategory);
  const categoryValues = categoryLabels.map(cat => salesByCategory[cat]);

  const ctxCategory = document.getElementById('categoryShareChart').getContext('2d');
  categoryShareChart = new Chart(ctxCategory, {
    type: 'doughnut',
    data: {
      labels: categoryLabels,
      datasets: [{
        data: categoryValues,
        backgroundColor: [
          '#cba382', '#38bdf8', '#34d399', '#f87171', '#a78bfa', '#fb923c'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } }
      }
    }
  });
}

// Data Table Render and Pagination
function renderTable() {
  tableBody.innerHTML = '';
  
  const startIndex = (tablePage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
  const pageData = filteredData.slice(startIndex, endIndex);

  if (pageData.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">暂无匹配数据</td></tr>`;
    paginationInfo.textContent = '显示 0 到 0 条，共 0 条';
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
    return;
  }

  pageData.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.date}</td>
      <td>${row.product}</td>
      <td>${row.category}</td>
      <td>${row.rep}</td>
      <td>${row.region}</td>
      <td>¥${row.sales.toLocaleString('zh-CN')}</td>
      <td class="text-right">${row.quantity}</td>
    `;
    tableBody.appendChild(tr);
  });

  paginationInfo.textContent = `显示 ${startIndex + 1} 到 ${endIndex} 条，共 ${filteredData.length} 条`;
  prevPageBtn.disabled = tablePage === 1;
  nextPageBtn.disabled = endIndex >= filteredData.length;
}

function changePage(direction) {
  tablePage += direction;
  renderTable();
}

// Table column sorting
function sortTable(column) {
  if (sortColumn === column) {
    sortAscending = !sortAscending;
  } else {
    sortColumn = column;
    sortAscending = true;
  }

  // Update table headers visual caret
  document.querySelectorAll('th').forEach(th => {
    const colAttr = th.getAttribute('onclick');
    if (colAttr && colAttr.includes(column)) {
      th.innerHTML = th.textContent.replace(/[▲▼]/g, '') + (sortAscending ? ' ▲' : ' ▼');
    } else {
      th.innerHTML = th.textContent.replace(/[▲▼]/g, '');
    }
  });

  applyFilters();
}

window.sortTable = sortTable;
