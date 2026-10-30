/* ==========================================================================
   Automation With Rohit — shared app shell and helpers
   Every page in the main app loads this file. It builds the sidebar + top
   bar around <main id="content">, and exposes small helpers on window.App.
   ========================================================================== */
(function () {
  "use strict";

  // ---------- icons (inline SVG, no external icon fonts) ----------
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    form: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    window: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><circle cx="6.5" cy="6.5" r=".6"/><circle cx="9" cy="6.5" r=".6"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11L21 7H6.2"/>',
    api: '<path d="M8 6 3 12l5 6M16 6l5 6-5 6M14 4l-4 16"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    logout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    check: '<path d="m5 12 5 5L20 7"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    upload: '<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  };
  function icon(name, cls = "") {
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ""}</svg>`;
  }

  // ---------- session (cookie + localStorage, so storage_state / cookie practice works) ----------
  const AUTH_KEY = "rohit.auth";
  function getCookie(name) {
    const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[-.]/g, "\\$&") + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(name, value, days) {
    const exp = days ? "; max-age=" + days * 86400 : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/${exp}; SameSite=Lax`;
  }
  function deleteCookie(name) {
    document.cookie = `${name}=; path=/; max-age=0`;
  }
  const store = {
    get(key, fallback = null) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
    },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked */ } },
    remove(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } },
  };
  function currentUser() {
    const name = getCookie("session-username");
    if (!name) return null;
    const saved = store.get(AUTH_KEY) || {};
    return { username: name, role: saved.role || "Employee", loginAt: saved.loginAt };
  }
  function login(username, role, remember) {
    setCookie("session-username", username, remember ? 7 : 0);
    store.set(AUTH_KEY, { username, role, loginAt: new Date().toISOString() });
  }
  function logout() {
    deleteCookie("session-username");
    store.remove(AUTH_KEY);
  }

  // ---------- registered users (signup page -> login page) ----------
  const USERS_KEY = "rohit.users";
  const registeredUsers = () => store.get(USERS_KEY, []);
  function registerUser(user) {
    const list = registeredUsers().filter((u) => u.email.toLowerCase() !== user.email.toLowerCase());
    list.push(user);
    store.set(USERS_KEY, list);
  }

  // ---------- cart (store pages) ----------
  const CART_KEY = "rohit.cart";
  const cart = {
    items: () => store.get(CART_KEY, []),
    save(items) { store.set(CART_KEY, items); updateCartBadge(); },
    count: () => cart.items().reduce((n, i) => n + i.qty, 0),
    add(product, qty = 1) {
      const items = cart.items();
      const found = items.find((i) => i.id === product.id);
      if (found) found.qty += qty;
      else items.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty });
      cart.save(items);
    },
    remove(id) { cart.save(cart.items().filter((i) => i.id !== id)); },
    setQty(id, qty) {
      const items = cart.items();
      const it = items.find((i) => i.id === id);
      if (it) it.qty = Math.max(1, qty);
      cart.save(items);
    },
    clear() { cart.save([]); },
  };
  function updateCartBadge() {
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      const n = cart.count();
      el.textContent = n;
      el.classList.toggle("hidden", n === 0);
    });
  }

  // ---------- toast ----------
  function toast(message, type = "success", ms = 3000) {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.id = "toast-container";
      document.body.appendChild(stack);
    }
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.setAttribute("data-testid", "toast");
    t.innerHTML = `${icon(type === "error" ? "x" : type === "info" ? "info" : "check")}<span class="toast-message"></span>`;
    t.querySelector("svg").style.cssText = "width:18px;height:18px;flex:none";
    t.querySelector(".toast-message").textContent = message;
    stack.appendChild(t);
    setTimeout(() => t.remove(), ms);
    return t;
  }

  // ---------- theme ----------
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("rohit.theme", theme); } catch { /* ignore */ }
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.innerHTML = icon(theme === "dark" ? "sun" : "moon");
  }

  // ---------- drag & drop that works in every tool ----------
  // Native HTML5 drag events (real users, Playwright, Cypress trigger('drop'))
  // PLUS a mouse-event fallback (Selenium Actions.dragAndDrop, Cypress
  // trigger('mousedown'/'mousemove'/'mouseup'), Playwright mouse.down/up).
  // By default the source is NOT draggable="true": that way the browser never
  // starts a native drag that would swallow Selenium's mouse events. Pass
  // { native: true } to keep real HTML5 drag-and-drop as well.
  function enableDragDrop(source, target, onDrop, opts = {}) {
    let dragging = false;
    let start = null;
    if (opts.native) source.setAttribute("draggable", "true");

    const fire = () => {
      target.classList.remove("over");
      onDrop(); // onDrop must be safe to call more than once
    };
    const inside = (x, y) => {
      const r = target.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };

    source.addEventListener("dragstart", (e) => {
      try { e.dataTransfer.setData("text/plain", source.id || "drag"); } catch { /* old browsers */ }
      source.classList.add("dragging");
    });
    source.addEventListener("dragend", () => {
      source.classList.remove("dragging");
      dragging = false;
      source.style.transform = "";
    });
    target.addEventListener("dragenter", (e) => { e.preventDefault(); target.classList.add("over"); });
    target.addEventListener("dragover", (e) => { e.preventDefault(); target.classList.add("over"); });
    target.addEventListener("dragleave", () => target.classList.remove("over"));
    target.addEventListener("drop", (e) => { e.preventDefault(); fire(); });

    source.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      if (!opts.native) e.preventDefault(); // stop text selection while dragging
      dragging = true;
      start = { x: e.clientX, y: e.clientY };
    });
    document.addEventListener("mousemove", (e) => {
      if (!dragging || !start) return;
      source.style.transform = `translate(${e.clientX - start.x}px, ${e.clientY - start.y}px)`;
      source.style.pointerEvents = "none";
      target.classList.toggle("over", inside(e.clientX, e.clientY));
    });
    document.addEventListener("mouseup", (e) => {
      if (!dragging) return;
      dragging = false;
      source.style.transform = "";
      source.style.pointerEvents = "";
      const moved = start && (Math.abs(e.clientX - start.x) > 3 || Math.abs(e.clientY - start.y) > 3);
      if (target.contains(e.target) || (moved && inside(e.clientX, e.clientY))) fire();
      target.classList.remove("over");
    });
  }

  // Adds a .hovered class on mouseover, so CSS hover menus also open with
  // Cypress trigger('mouseover') and Selenium Actions.moveToElement.
  function enableHover(el) {
    el.addEventListener("mouseenter", () => el.classList.add("hovered"));
    el.addEventListener("mouseover", () => el.classList.add("hovered"));
    el.addEventListener("mouseleave", () => el.classList.remove("hovered"));
    el.addEventListener("focusin", () => el.classList.add("hovered"));
    el.addEventListener("focusout", (e) => { if (!el.contains(e.relatedTarget)) el.classList.remove("hovered"); });
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  }

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "$" + Number(n).toFixed(2);

  // ---------- shell ----------
  const NAV = [
    { section: "Practice" },
    { id: "home", label: "Overview", href: "/home.html", icon: "home" },
    { id: "elements", label: "Practice Elements", href: "/dashboard/dashboard.html", icon: "grid" },
    { id: "forms", label: "Forms", href: "/forms.html", icon: "form" },
    { id: "components", label: "UI Components", href: "/components.html", icon: "layers" },
    { id: "webtable", label: "Web Tables", href: "/webTable.html", icon: "table" },
    { id: "waits", label: "Waits & Dynamic", href: "/waits.html", icon: "clock" },
    { id: "frames", label: "Frames & Windows", href: "/frames.html", icon: "window" },
    { id: "advanced", label: "Advanced Elements", href: "/advanced.html", icon: "cpu" },
    { section: "E-commerce" },
    { id: "store", label: "Shop", href: "/store/store.html", icon: "bag" },
    { id: "cart", label: "Cart", href: "/store/cart.html", icon: "cart", badge: true },
    { section: "API Testing" },
    { id: "api", label: "API Playground", href: "/api.html", icon: "api" },
    { id: "basicauth", label: "Basic Auth Page", href: "/basic-auth", icon: "lock" },
    { section: "Study Labs" },
    { id: "lab-form", label: "Lab: Practice Form", href: "/practice-form.html", icon: "flask" },
    { id: "lab-widgets", label: "Lab: Widgets", href: "/widgets.html", icon: "flask" },
    { id: "lab-shop", label: "Lab: Mini Shop", href: "/shop.html", icon: "flask" },
    { section: "Account" },
    { id: "profile", label: "My Profile", href: "/profile.html", icon: "user" },
    { id: "contact", label: "Contact", href: "/contact/contact.html", icon: "mail" },
    { id: "about", label: "About", href: "/about/about.html", icon: "info" },
  ];

  function buildShell() {
    const content = document.getElementById("content");
    if (!content || document.body.dataset.shell === "none") return;
    const page = document.body.dataset.page || "";
    const title = document.body.dataset.title || document.title;
    const user = currentUser();

    const nav = NAV.map((n) => {
      if (n.section) return `<div class="nav-section">${n.section}</div>`;
      const badge = n.badge ? `<span class="nav-badge hidden" data-cart-count>0</span>` : "";
      return `<a class="nav-link${n.id === page ? " active" : ""}" id="nav-${n.id}" href="${n.href}"${n.id === page ? ' aria-current="page"' : ""}>${icon(n.icon)}<span>${n.label}</span>${badge}</a>`;
    }).join("");

    const app = document.createElement("div");
    app.className = "app";
    app.innerHTML = `
      <aside class="sidebar" id="sidebar" aria-label="Main navigation">
        <a class="brand" href="/home.html" id="brand-link"><span class="brand-mark">AR</span><span>Automation With Rohit<small>Practice Web App</small></span></a>
        <nav class="sidebar-nav">${nav}</nav>
        <div class="sidebar-footer">v2.0 · Selenium · Cypress · Playwright · Postman</div>
      </aside>
      <div class="main">
        <header class="topbar">
          <button class="icon-btn sidebar-toggle" id="sidebar-toggle" type="button" aria-label="Toggle sidebar">${icon("menu")}</button>
          <div class="crumbs" id="breadcrumb"><a href="/home.html">Home</a> / <b>${escapeHtml(title)}</b></div>
          <div class="spacer"></div>
          <button class="icon-btn" id="theme-toggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode"></button>
          <div class="user-menu" id="user-menu">
            ${user
              ? `<button class="user-menu-btn" id="user-menu-button" type="button" aria-haspopup="true" aria-expanded="false"><span class="avatar">${escapeHtml(user.username.slice(0, 2).toUpperCase())}</span><span id="logged-in-user">${escapeHtml(user.username)}</span></button>
                 <div class="dropdown-menu" id="user-dropdown" role="menu">
                   <a href="/profile.html" id="menu-profile" role="menuitem">${icon("user")} My Profile</a>
                   <a href="/store/cart.html" id="menu-cart" role="menuitem">${icon("cart")} My Cart</a>
                   <div class="divider"></div>
                   <button type="button" id="menu-signout" role="menuitem">${icon("logout")} Sign out</button>
                 </div>`
              : `<a class="btn btn-primary btn-sm" id="topbar-signin" href="/index.html">Sign in</a>`}
          </div>
        </header>
      </div>`;
    const main = app.querySelector(".main");
    document.body.insertBefore(app, content);
    main.appendChild(content);
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `<span>© ${new Date().getFullYear()} Automation With Rohit · Built for automation practice</span><span><a href="/api.html">API</a> · <a href="/contact/contact.html">Contact</a> · <a href="/about/about.html">About</a></span>`;
    main.appendChild(footer);

    applyTheme(document.documentElement.dataset.theme || "light");
    document.getElementById("theme-toggle").addEventListener("click", () =>
      applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark")
    );
    document.getElementById("sidebar-toggle").addEventListener("click", () => document.body.classList.toggle("sidebar-open"));

    const menuBtn = document.getElementById("user-menu-button");
    if (menuBtn) {
      const dd = document.getElementById("user-dropdown");
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = dd.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(open));
      });
      document.addEventListener("click", (e) => {
        if (!dd.contains(e.target)) { dd.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
      });
      document.getElementById("menu-signout").addEventListener("click", () => {
        logout();
        window.location.href = "/index.html";
      });
    }
    updateCartBadge();
  }

  // Pages with data-auth="required" redirect to the login page when signed out.
  function guard() {
    if (document.body.dataset.auth === "required" && !currentUser()) {
      window.location.replace("/index.html?redirect=" + encodeURIComponent(location.pathname));
      return false;
    }
    return true;
  }

  window.App = {
    icon, toast, cart, store, login, logout, currentUser, registeredUsers, registerUser,
    getCookie, setCookie, deleteCookie, enableDragDrop, enableHover, copyText, escapeHtml, money, applyTheme,
  };

  if (guard()) buildShell();
})();
