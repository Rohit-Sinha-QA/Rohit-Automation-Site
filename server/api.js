// Practice REST API for "Automation With Rohit".
// Framework-free: handleApi() takes a plain request object and returns
// { status, headers, body }. server.js (Node http) and the Netlify function
// both call it, so the API behaves the same everywhere.
const crypto = require("crypto");
const { freshUsers, freshProducts } = require("./data");

const TOKEN_SECRET = process.env.TOKEN_SECRET || "rohit-automation-practice-secret";
const TOKEN_TTL_SECONDS = 24 * 60 * 60;

// The same credentials work on the UI login page and in the API.
const ACCOUNTS = {
  admin: { password: "admin@1234", role: "admin", name: "Admin User" },
  student: { password: "student@1234", role: "student", name: "Student User" },
  locked_user: { password: "admin@1234", role: "student", name: "Locked User", locked: true },
};

const state = {};
function resetState() {
  state.users = freshUsers();
  state.products = freshProducts();
  state.orders = [];
  state.nextUserId = state.users.length + 1;
  state.nextOrderId = 1001;
}
resetState();

// ---------- tokens (stateless + signed, so they also work on serverless hosts) ----------
const b64url = (s) => Buffer.from(s).toString("base64url");
const sign = (payload) => crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url");

function createToken(username) {
  const payload = b64url(JSON.stringify({ sub: username, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS }));
  return `${payload}.${sign(payload)}`;
}
function verifyToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (sign(payload) !== signature) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.exp >= Math.floor(Date.now() / 1000) ? data : null;
  } catch {
    return null;
  }
}

// ---------- helpers ----------
const json = (status, body, headers = {}) => ({ status, headers, body });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_FIELDS = ["name", "email", "job", "city", "status"];
const STATUSES = ["active", "inactive"];

function authError(req) {
  const header = req.headers["authorization"] || "";
  if (!header) {
    return json(401, {
      error: "Authorization token is missing",
      hint: "Send header  Authorization: Bearer <token>  (get a token from POST /api/auth/login)",
    });
  }
  const data = verifyToken(header.replace(/^Bearer\s+/i, "").trim());
  if (!data) return json(401, { error: "Invalid or expired token" });
  req.username = data.sub;
  return null;
}

function validateUser(body, partial = false) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return ["Request body must be a JSON object"];
  const errors = [];
  const unknown = Object.keys(body).filter((k) => !USER_FIELDS.includes(k));
  if (unknown.length) errors.push(`Unknown field(s): ${unknown.join(", ")}`);
  if (partial && Object.keys(body).length === 0) errors.push("Request body must contain at least one field to update");
  if (!partial || "name" in body) {
    if (typeof body.name !== "string" || !body.name.trim()) errors.push("name is required and must be a non-empty string");
  }
  if (!partial || "email" in body) {
    if (typeof body.email !== "string" || !EMAIL_RE.test(body.email)) errors.push("email is required and must be a valid email address");
  }
  for (const f of ["job", "city"]) if (f in body && typeof body[f] !== "string") errors.push(`${f} must be a string`);
  if ("status" in body && !STATUSES.includes(body.status)) errors.push(`status must be one of: ${STATUSES.join(", ")}`);
  return errors;
}

function lookupUser(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) return { error: json(400, { error: "User id must be a positive whole number" }) };
  const user = state.users.find((u) => u.id === id);
  if (!user) return { error: json(404, { error: `User with id ${id} not found` }) };
  return { user };
}

const emailTaken = (email, exceptId) =>
  state.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase() && u.id !== exceptId);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- route handlers ----------
const routes = [];
const route = (method, pattern, handler) => {
  const keys = [];
  const re = new RegExp("^" + pattern.replace(/:(\w+)/g, (_, k) => (keys.push(k), "([^/]+)")) + "/?$");
  routes.push({ method, re, keys, handler });
};

route("GET", "", () =>
  json(200, {
    name: "Automation With Rohit - Practice API",
    version: "2.0.0",
    docs: "/api.html",
    endpoints: [
      "GET    /api/health",
      "POST   /api/auth/login",
      "GET    /api/auth/me              (auth)",
      "GET    /api/users?page=1&limit=10&status=active&city=Hyderabad&search=ravi",
      "GET    /api/users/:id",
      "POST   /api/users",
      "PUT    /api/users/:id            (auth)",
      "PATCH  /api/users/:id            (auth)",
      "DELETE /api/users/:id            (auth)",
      "GET    /api/products?category=Clothing&sort=price_asc&search=shirt&in_stock=true",
      "GET    /api/products/:id",
      "POST   /api/cart",
      "POST   /api/orders",
      "GET    /api/orders/:id",
      "ANY    /api/echo",
      "GET    /api/status/:code",
      "GET    /api/delay/:seconds",
      "POST   /api/reset",
    ],
  })
);

route("GET", "/health", () =>
  json(200, { status: "UP", timestamp: new Date().toISOString(), uptime_seconds: Math.round(process.uptime()) })
);

// ----- auth -----
route("POST", "/auth/login", (req) => {
  const { username, password } = req.body || {};
  if (!username || !password) return json(400, { error: "username and password are required" });
  const account = ACCOUNTS[username];
  if (!account || account.password !== password) return json(401, { error: "Invalid username or password" });
  if (account.locked) return json(403, { error: "Sorry, this user has been locked out" });
  return json(200, {
    token: createToken(username),
    token_type: "Bearer",
    expires_in: TOKEN_TTL_SECONDS,
    user: { username, name: account.name, role: account.role },
  });
});

route("GET", "/auth/me", (req) => {
  const err = authError(req);
  if (err) return err;
  const a = ACCOUNTS[req.username];
  return json(200, { username: req.username, name: a.name, role: a.role });
});

// ----- users -----
route("GET", "/users", (req) => {
  const q = req.query;
  const page = Math.max(1, parseInt(q.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(q.limit, 10) || 10));
  let list = state.users.slice();
  if (q.status) list = list.filter((u) => u.status === String(q.status).toLowerCase());
  if (q.city) list = list.filter((u) => u.city.toLowerCase() === String(q.city).toLowerCase());
  if (q.search) {
    const s = String(q.search).toLowerCase();
    list = list.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }
  return json(200, {
    page,
    limit,
    total: list.length,
    total_pages: Math.ceil(list.length / limit),
    data: list.slice((page - 1) * limit, page * limit),
  });
});

route("GET", "/users/:id", (req) => {
  const { user, error } = lookupUser(req.params.id);
  return error || json(200, user);
});

route("POST", "/users", (req) => {
  const errors = validateUser(req.body);
  if (errors.length) return json(400, { error: "Validation failed", details: errors });
  if (emailTaken(req.body.email)) return json(409, { error: `A user with email ${req.body.email} already exists` });
  const user = {
    id: state.nextUserId++,
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    job: req.body.job || "",
    city: req.body.city || "",
    status: req.body.status || "active",
    created_at: new Date().toISOString(),
  };
  state.users.push(user);
  return json(201, user, { Location: `/api/users/${user.id}` });
});

route("PUT", "/users/:id", (req) => {
  const err = authError(req);
  if (err) return err;
  const { user, error } = lookupUser(req.params.id);
  if (error) return error;
  const errors = validateUser(req.body);
  if (errors.length) return json(400, { error: "Validation failed", details: errors });
  if (emailTaken(req.body.email, user.id)) return json(409, { error: `A user with email ${req.body.email} already exists` });
  Object.assign(user, {
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    job: req.body.job || "",
    city: req.body.city || "",
    status: req.body.status || "active",
    updated_at: new Date().toISOString(),
  });
  return json(200, user);
});

route("PATCH", "/users/:id", (req) => {
  const err = authError(req);
  if (err) return err;
  const { user, error } = lookupUser(req.params.id);
  if (error) return error;
  const errors = validateUser(req.body, true);
  if (errors.length) return json(400, { error: "Validation failed", details: errors });
  if (req.body.email && emailTaken(req.body.email, user.id)) return json(409, { error: `A user with email ${req.body.email} already exists` });
  for (const f of USER_FIELDS) if (f in req.body) user[f] = typeof req.body[f] === "string" ? req.body[f].trim() : req.body[f];
  user.updated_at = new Date().toISOString();
  return json(200, user);
});

route("DELETE", "/users/:id", (req) => {
  const err = authError(req);
  if (err) return err;
  const { user, error } = lookupUser(req.params.id);
  if (error) return error;
  state.users = state.users.filter((u) => u.id !== user.id);
  return json(200, { message: `User ${user.id} deleted successfully`, id: user.id });
});

// ----- products -----
const SORTERS = {
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  name_asc: (a, b) => a.name.localeCompare(b.name),
  name_desc: (a, b) => b.name.localeCompare(a.name),
  rating: (a, b) => b.rating - a.rating,
};

route("GET", "/products", (req) => {
  const q = req.query;
  let list = state.products.slice();
  if (q.category) list = list.filter((p) => p.category.toLowerCase() === String(q.category).toLowerCase());
  if (q.search) list = list.filter((p) => p.name.toLowerCase().includes(String(q.search).toLowerCase()));
  if (q.in_stock === "true") list = list.filter((p) => p.stock > 0);
  if (q.sort) {
    if (!SORTERS[q.sort]) return json(400, { error: `sort must be one of: ${Object.keys(SORTERS).join(", ")}` });
    list.sort(SORTERS[q.sort]);
  }
  return json(200, { total: list.length, data: list });
});

route("GET", "/products/:id", (req) => {
  const product = state.products.find((p) => p.id === Number(req.params.id));
  return product ? json(200, product) : json(404, { error: `Product with id ${req.params.id} not found` });
});

// ----- cart & orders -----
route("POST", "/cart", (req) => {
  const { id, qty = 1 } = req.body || {};
  if (id === undefined || id === null || id === "") return json(400, { error: "id is required" });
  const product = state.products.find((p) => p.id === Number(id));
  if (!product) return json(404, { error: `Product with id ${id} not found` });
  if (!Number.isInteger(Number(qty)) || Number(qty) < 1) return json(400, { error: "qty must be a whole number of 1 or more" });
  if (product.stock < Number(qty)) return json(409, { error: `${product.name} is out of stock` });
  return json(200, {
    message: `Added ${product.name} to cart`,
    item: { id: product.id, name: product.name, price: product.price, qty: Number(qty) },
  });
});

route("POST", "/orders", (req) => {
  const { customer, items } = req.body || {};
  const errors = [];
  if (!customer || !customer.first_name || !customer.last_name || !customer.postal_code)
    errors.push("customer.first_name, customer.last_name and customer.postal_code are required");
  if (!Array.isArray(items) || items.length === 0) errors.push("items must be a non-empty array of { id, qty }");
  if (errors.length) return json(400, { error: "Validation failed", details: errors });
  const lines = [];
  for (const it of items) {
    const p = state.products.find((x) => x.id === Number(it.id));
    if (!p) return json(404, { error: `Product with id ${it.id} not found` });
    lines.push({ id: p.id, name: p.name, price: p.price, qty: Math.max(1, Number(it.qty) || 1) });
  }
  const subtotal = +lines.reduce((s, l) => s + l.price * l.qty, 0).toFixed(2);
  const tax = +(subtotal * 0.08).toFixed(2);
  const order = {
    order_id: state.nextOrderId++,
    status: "CONFIRMED",
    customer,
    items: lines,
    subtotal,
    tax,
    total: +(subtotal + tax).toFixed(2),
    created_at: new Date().toISOString(),
  };
  state.orders.push(order);
  return json(201, order, { Location: `/api/orders/${order.order_id}` });
});

route("GET", "/orders/:id", (req) => {
  const order = state.orders.find((o) => o.order_id === Number(req.params.id));
  return order ? json(200, order) : json(404, { error: `Order ${req.params.id} not found` });
});

// ----- utilities -----
route("ANY", "/echo", (req) =>
  json(200, { method: req.method, path: req.path, query: req.query, headers: req.headers, body: req.body ?? null })
);

route("GET", "/status/:code", (req) => {
  const code = Number(req.params.code);
  if (!Number.isInteger(code) || code < 200 || code > 599) return json(400, { error: "code must be between 200 and 599" });
  if (code === 204 || code === 304) return { status: code, headers: {}, body: null };
  return json(code, { status: code, message: `This endpoint returned status ${code}` });
});

route("GET", "/delay/:seconds", async (req) => {
  const s = Math.min(10, Math.max(0, Number(req.params.seconds) || 0));
  await sleep(s * 1000);
  return json(200, { message: `Responded after ${s} second(s)`, delayed_seconds: s });
});

route("POST", "/reset", () => {
  resetState();
  return json(200, { message: "All practice data has been reset", users: state.users.length, products: state.products.length });
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Request-Id",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Cache-Control": "no-store",
};

/**
 * @param {{method:string, path:string, query:object, headers:object, rawBody:string}} req
 *   path is relative to /api, e.g. "/users/3"
 */
async function handleApi(req) {
  const method = req.method.toUpperCase();
  if (method === "OPTIONS") return { status: 204, headers: CORS, body: null };

  // Parse the body: JSON, or classic HTML/Postman form data.
  req.body = undefined;
  const raw = req.rawBody || "";
  const type = (req.headers["content-type"] || "").toLowerCase();
  if (raw.trim()) {
    if (type.includes("application/x-www-form-urlencoded")) {
      req.body = Object.fromEntries(new URLSearchParams(raw));
    } else {
      try {
        req.body = JSON.parse(raw);
      } catch (e) {
        return { status: 400, headers: CORS, body: { error: "Invalid JSON body", details: [e.message] } };
      }
    }
  }

  const path = req.path.replace(/\/+$/, "");
  let pathMatched = false;
  for (const r of routes) {
    const m = path.match(r.re);
    if (!m) continue;
    pathMatched = true;
    if (r.method !== "ANY" && r.method !== method) continue;
    req.params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
    try {
      const res = await r.handler(req);
      return { ...res, headers: { ...CORS, ...res.headers } };
    } catch (e) {
      console.error(e);
      return { status: 500, headers: CORS, body: { error: "Internal server error" } };
    }
  }
  if (pathMatched) {
    return { status: 405, headers: CORS, body: { error: `Method ${method} is not allowed on /api${path}` } };
  }
  return { status: 404, headers: CORS, body: { error: `No API route for ${method} /api${path}`, docs: "/api" } };
}

// HTTP Basic Auth check for the /basic-auth practice page (admin / admin).
function basicAuthOk(authorizationHeader) {
  const [scheme, encoded] = String(authorizationHeader || "").split(" ");
  if (scheme !== "Basic" || !encoded) return false;
  const [user, pass] = Buffer.from(encoded, "base64").toString().split(":");
  return user === "admin" && pass === "admin";
}

module.exports = { handleApi, basicAuthOk, resetState };
