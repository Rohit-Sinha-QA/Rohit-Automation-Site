// Web Tables page
document.addEventListener("DOMContentLoaded", function () {
  const $ = (id) => document.getElementById(id);

  // ================= 1. Paginated table =================
  const allRows = Array.from($("dataTable").tBodies[0].rows);
  let currentPage = 1;
  let rowsPerPage = 10;
  let visibleRows = allRows;

  function totalPages() {
    return Math.max(1, Math.ceil(visibleRows.length / rowsPerPage));
  }

  function displayRows(page) {
    currentPage = Math.min(Math.max(1, page), totalPages());
    const start = (currentPage - 1) * rowsPerPage;
    allRows.forEach((r) => (r.style.display = "none"));
    visibleRows.slice(start, start + rowsPerPage).forEach((r) => (r.style.display = ""));
    renderPagination();
    const end = Math.min(start + rowsPerPage, visibleRows.length);
    $("pageInfo").textContent = visibleRows.length
      ? `Page ${currentPage} of ${totalPages()} · Showing ${start + 1}-${end} of ${visibleRows.length} entries`
      : "No matching records";
  }

  function pageItem(label, page, { active = false, disabled = false, id } = {}) {
    return `<li class="page-item${active ? " active" : ""}${disabled ? " disabled" : ""}">` +
      `<a class="page-link" href="#" data-page="${page}"${id ? ` id="${id}"` : ""}${active ? ' aria-current="page"' : ""}>${label}</a></li>`;
  }

  function renderPagination() {
    const pages = totalPages();
    let html = pageItem("Previous", "prev", { disabled: currentPage === 1, id: "prevPage" });
    for (let i = 1; i <= pages; i++) html += pageItem(i, i, { active: i === currentPage });
    html += pageItem("Next", "next", { disabled: currentPage === pages, id: "nextPage" });
    $("pagination").innerHTML = html;
  }

  // Fixed: "Next" used to call changePage(1), the same value as page 1, so clicking
  // page 1 jumped forward. Pages, Previous and Next now use separate values.
  $("pagination").addEventListener("click", (e) => {
    const link = e.target.closest(".page-link");
    if (!link) return;
    e.preventDefault();
    const p = link.dataset.page;
    if (p === "prev") displayRows(currentPage - 1);
    else if (p === "next") displayRows(currentPage + 1);
    else displayRows(Number(p));
  });
  window.changePage = (page) => displayRows(page); // kept for older scripts

  $("rowsPerPage").addEventListener("change", (e) => {
    rowsPerPage = Number(e.target.value);
    displayRows(1);
  });
  $("tableSearch").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    visibleRows = allRows.filter((r) => !q || r.cells[1].textContent.toLowerCase().includes(q) || r.cells[3].textContent.toLowerCase().includes(q));
    displayRows(1);
  });
  displayRows(1);

  // ================= 2. Orders =================
  const orders = $("ordersTable");
  const checks = () => Array.from(orders.querySelectorAll(".row-check"));
  function refreshOrders() {
    const rows = Array.from(orders.tBodies[0].rows);
    const total = rows.reduce((s, r) => s + Number(r.querySelector(".amount").textContent), 0);
    $("ordersTotal").textContent = total.toFixed(2);
    $("ordersCaption").textContent = `${rows.length} order${rows.length === 1 ? "" : "s"}`;
    const selected = checks().filter((c) => c.checked);
    $("deleteSelected").disabled = selected.length === 0;
    $("deleteSelected").textContent = selected.length ? `Delete selected (${selected.length})` : "Delete selected";
    $("selectAll").checked = selected.length > 0 && selected.length === checks().length;
    $("selectAll").indeterminate = selected.length > 0 && selected.length < checks().length;
    rows.forEach((r) => r.classList.toggle("selected", r.querySelector(".row-check").checked));
  }
  $("selectAll").addEventListener("change", (e) => {
    checks().forEach((c) => (c.checked = e.target.checked));
    refreshOrders();
  });
  orders.addEventListener("change", (e) => { if (e.target.classList.contains("row-check")) refreshOrders(); });
  orders.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-btn");
    if (!btn) return;
    const cells = btn.closest("tr").cells;
    $("order-detail").textContent = `Order ${cells[1].textContent} for ${cells[2].textContent} - ${cells[3].textContent.trim()} - $${cells[4].textContent}`;
  });
  $("deleteSelected").addEventListener("click", () => {
    const ids = checks().filter((c) => c.checked).map((c) => c.closest("tr"));
    if (!confirm(`Delete ${ids.length} selected order(s)?`)) return;
    ids.forEach((r) => r.remove());
    $("order-detail").textContent = `${ids.length} order(s) deleted`;
    refreshOrders();
  });

  // ================= 3. Employees CRUD =================
  let employees = [
    { id: 1, name: "Ravi Kumar", email: "ravi@company.com", department: "QA", salary: 65000 },
    { id: 2, name: "Asha Rao", email: "asha@company.com", department: "Development", salary: 82000 },
    { id: 3, name: "John Smith", email: "john@company.com", department: "DevOps", salary: 78000 },
    { id: 4, name: "Meera Iyer", email: "meera@company.com", department: "HR", salary: 54000 },
    { id: 5, name: "Arjun Das", email: "arjun@company.com", department: "Finance", salary: 61000 },
    { id: 6, name: "Priya Sharma", email: "priya@company.com", department: "QA", salary: 70000 },
  ];
  let nextId = 7;
  let sortKey = "id";
  let sortDir = 1;
  const tbody = $("employeeTable").tBodies[0];

  function renderEmployees() {
    const q = $("employeeSearch").value.toLowerCase().trim();
    const list = employees
      .filter((e) => !q || [e.name, e.email, e.department].some((v) => v.toLowerCase().includes(q)))
      .sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : a[sortKey] < b[sortKey] ? -1 : 0) * sortDir);
    tbody.innerHTML = list.length
      ? list.map((e) => `
        <tr data-id="${e.id}">
          <td>${e.id}</td>
          <td>${App.escapeHtml(e.name)}</td>
          <td>${App.escapeHtml(e.email)}</td>
          <td>${App.escapeHtml(e.department)}</td>
          <td>${e.salary}</td>
          <td class="row" style="gap:6px;flex-wrap:nowrap">
            <button type="button" class="btn btn-secondary btn-sm edit-btn" id="edit-${e.id}" aria-label="Edit ${App.escapeHtml(e.name)}">Edit</button>
            <button type="button" class="btn btn-ghost btn-sm delete-btn" id="delete-${e.id}" aria-label="Delete ${App.escapeHtml(e.name)}" style="color:var(--danger)">Delete</button>
          </td>
        </tr>`).join("")
      : `<tr><td colspan="6" class="empty-state">No employees found</td></tr>`;
    $("employeeCount").textContent = `${list.length} of ${employees.length} employees`;
    document.querySelectorAll("#employeeTable th.sortable").forEach((th) => {
      th.querySelector(".sort-ind").textContent = th.dataset.key === sortKey ? (sortDir === 1 ? "▲" : "▼") : "";
      th.setAttribute("aria-sort", th.dataset.key === sortKey ? (sortDir === 1 ? "ascending" : "descending") : "none");
    });
  }

  document.querySelectorAll("#employeeTable th.sortable").forEach((th) =>
    th.addEventListener("click", () => {
      sortDir = sortKey === th.dataset.key ? -sortDir : 1;
      sortKey = th.dataset.key;
      renderEmployees();
    })
  );
  $("employeeSearch").addEventListener("input", renderEmployees);

  const form = $("employeeForm");
  function openForm(emp) {
    form.classList.remove("hidden");
    $("employeeFormTitle").textContent = emp ? `Edit Employee #${emp.id}` : "Add Employee";
    $("empId").value = emp ? emp.id : "";
    $("empName").value = emp ? emp.name : "";
    $("empEmail").value = emp ? emp.email : "";
    $("empDept").value = emp ? emp.department : "";
    $("empSalary").value = emp ? emp.salary : "";
    $("employeeFormError").textContent = "";
    $("empName").focus();
  }
  $("addEmployeeBtn").addEventListener("click", () => openForm(null));
  $("cancelEmployee").addEventListener("click", () => form.classList.add("hidden"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      name: $("empName").value.trim(),
      email: $("empEmail").value.trim(),
      department: $("empDept").value,
      salary: Number($("empSalary").value),
    };
    if (!data.name || !data.email || !data.department || !$("empSalary").value) {
      $("employeeFormError").textContent = "All fields are required";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      $("employeeFormError").textContent = "Please enter a valid email";
      return;
    }
    const id = Number($("empId").value);
    if (id) {
      Object.assign(employees.find((x) => x.id === id), data);
      App.toast(`Employee ${data.name} updated`);
    } else {
      employees.push({ id: nextId++, ...data });
      App.toast(`Employee ${data.name} added`);
    }
    form.classList.add("hidden");
    renderEmployees();
  });
  tbody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (!row || !row.dataset.id) return;
    const emp = employees.find((x) => x.id === Number(row.dataset.id));
    if (e.target.classList.contains("edit-btn")) openForm(emp);
    if (e.target.classList.contains("delete-btn")) {
      if (!confirm(`Delete employee ${emp.name}?`)) return;
      employees = employees.filter((x) => x.id !== emp.id);
      App.toast(`Employee ${emp.name} deleted`, "info");
      renderEmployees();
    }
  });
  renderEmployees();
});
