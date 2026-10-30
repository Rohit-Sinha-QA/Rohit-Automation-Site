// API Playground page
document.addEventListener("DOMContentLoaded", function () {
  const $ = (id) => document.getElementById(id);
  const origin = location.protocol.startsWith("http") ? location.origin : "http://localhost:3000";
  $("baseUrl").textContent = origin + "/api";

  const user = (o = {}) => JSON.stringify({ name: "Rohit Sinha", email: "rohit.sinha@example.com", job: "Automation Trainer", city: "Hyderabad", status: "active", ...o }, null, 2);

  const GROUPS = [
    { name: "Auth", items: [
      { m: "POST", p: "/api/auth/login", d: "Get a Bearer token", body: JSON.stringify({ username: "admin", password: "admin@1234" }, null, 2) },
      { m: "GET", p: "/api/auth/me", d: "Who am I (needs token)", auth: true },
    ]},
    { name: "Users", items: [
      { m: "GET", p: "/api/users", d: "List users (paginated)" },
      { m: "GET", p: "/api/users?page=2&limit=5", d: "Page 2, 5 per page" },
      { m: "GET", p: "/api/users?status=active&city=Hyderabad", d: "Filter by status and city" },
      { m: "GET", p: "/api/users/1", d: "Get one user" },
      { m: "GET", p: "/api/users/999", d: "User not found (404)" },
      { m: "POST", p: "/api/users", d: "Create a user (201)", body: user() },
      { m: "POST", p: "/api/users", d: "Validation error (400)", body: JSON.stringify({ name: "" }, null, 2) },
      { m: "PUT", p: "/api/users/1", d: "Replace a user (token)", auth: true, body: user({ name: "Ravi Kumar", email: "ravi.kumar@example.com", job: "Senior QA Engineer" }) },
      { m: "PATCH", p: "/api/users/1", d: "Update some fields (token)", auth: true, body: JSON.stringify({ job: "QA Manager", status: "inactive" }, null, 2) },
      { m: "DELETE", p: "/api/users/2", d: "Delete a user (token)", auth: true },
    ]},
    { name: "Products, cart & orders", items: [
      { m: "GET", p: "/api/products", d: "List products" },
      { m: "GET", p: "/api/products?category=Clothing&sort=price_asc", d: "Filter + sort" },
      { m: "GET", p: "/api/products/3", d: "Get one product" },
      { m: "POST", p: "/api/cart", d: "Add to cart", body: JSON.stringify({ id: 2, qty: 1 }, null, 2) },
      { m: "POST", p: "/api/orders", d: "Place an order (201)", body: JSON.stringify({ customer: { first_name: "Ravi", last_name: "Kumar", postal_code: "500081" }, items: [{ id: 1, qty: 2 }, { id: 3, qty: 1 }] }, null, 2) },
      { m: "GET", p: "/api/orders/1001", d: "Get an order" },
    ]},
    { name: "Utilities", items: [
      { m: "GET", p: "/api/health", d: "Health check" },
      { m: "POST", p: "/api/echo?source=playground", d: "Echo back the request", body: JSON.stringify({ hello: "world" }, null, 2) },
      { m: "GET", p: "/api/status/503", d: "Any status code on demand" },
      { m: "GET", p: "/api/delay/3", d: "Slow response (3s)" },
      { m: "POST", p: "/api/reset", d: "Reset all data" },
    ]},
  ];

  $("endpointList").innerHTML = GROUPS.map((g) => `
    <div class="nav-section" style="padding:14px 16px 6px">${g.name}</div>
    ${g.items.map((e, i) => `
      <div class="endpoint" role="button" tabindex="0" data-group="${g.name}" data-index="${i}" id="ep-${g.name.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "")}-${i}">
        <span class="method method-${e.m.toLowerCase()}">${e.m}</span>
        <span class="path">${e.p}</span>
        <span class="desc">${e.d}${e.auth ? " 🔒" : ""}</span>
      </div>`).join("")}`).join("");

  function load(e) {
    $("requestMethod").value = e.m;
    $("requestUrl").value = e.p;
    $("requestBody").value = e.body || "";
    $("useAuth").checked = Boolean(e.auth);
    $("endpointDesc").textContent = `${e.m} ${e.p} — ${e.d}`;
  }
  $("endpointList").addEventListener("click", (ev) => {
    const row = ev.target.closest(".endpoint");
    if (!row) return;
    load(GROUPS.find((g) => g.name === row.dataset.group).items[row.dataset.index]);
  });
  $("endpointList").addEventListener("keydown", (ev) => { if (ev.key === "Enter") ev.target.click(); });

  const pill = (el, status) => {
    el.textContent = status ? String(status) : "ERR";
    el.className = "status-pill " + (status >= 500 || !status ? "status-5xx" : status >= 400 ? "status-4xx" : "status-2xx");
  };

  async function send() {
    const method = $("requestMethod").value;
    const url = $("requestUrl").value.trim();
    const headers = { Accept: "application/json" };
    const opts = { method, headers };
    if ($("requestBody").value.trim() && method !== "GET") {
      headers["Content-Type"] = "application/json";
      opts.body = $("requestBody").value;
    }
    if ($("useAuth").checked) headers.Authorization = "Bearer " + $("authToken").value.trim();
    $("responseBody").textContent = "Sending...";
    $("sendRequest").disabled = true;
    const started = performance.now();
    try {
      const res = await fetch(url, opts);
      const ms = Math.round(performance.now() - started);
      const text = await res.text();
      let pretty = text;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch { /* not JSON */ }
      pill($("responseStatus"), res.status);
      $("responseStatus").textContent = `${res.status} ${res.statusText}`;
      $("responseTime").textContent = `${ms} ms · ${text.length} bytes`;
      $("responseBody").textContent = pretty || "(empty body)";
      $("responseHeaders").textContent = [...res.headers.entries()].map(([k, v]) => `${k}: ${v}`).join("\n");
      if (url.includes("/auth/login") && res.ok) {
        const token = JSON.parse(text).token;
        if (token) { $("authToken").value = token; App.toast("Token saved - tick 'Send Authorization' to use it"); }
      }
    } catch (err) {
      pill($("responseStatus"), 0);
      $("responseBody").textContent = "Network error: " + err.message + "\n\nIs the server running? Start it with: node server.js";
    } finally {
      $("sendRequest").disabled = false;
    }
  }
  $("sendRequest").addEventListener("click", send);
  $("requestUrl").addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });

  $("getTokenBtn").addEventListener("click", async () => {
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: "admin", password: "admin@1234" }) });
      const body = await res.json();
      $("authToken").value = body.token;
      $("useAuth").checked = true;
      App.toast("Token received");
    } catch {
      App.toast("Could not reach the API server", "error");
    }
  });

  fetch("/api/health")
    .then((r) => r.json())
    .then((b) => { $("healthStatus").textContent = b.status; $("healthStatus").className = "status-pill status-2xx"; })
    .catch(() => { $("healthStatus").textContent = "OFFLINE"; $("healthStatus").className = "status-pill status-5xx"; $("apiOffline").classList.remove("hidden"); });

  load(GROUPS[1].items[0]);
});
