# Automation With Rohit — Practice Web App & REST API

A realistic practice application for learning **UI automation** (Selenium, Cypress, Playwright, WebdriverIO, Robot Framework)
and **API testing** (Postman, Rest Assured, Playwright `APIRequestContext`, Python `requests`).

- Every element is plain HTML, so the same page can be automated with any tool.
- Locators are simple and stable: readable `id`s, `name`s, real `<label>`s, visible button text, and `data-testid` on key elements.
- A built-in REST API supports **GET, POST, PUT, PATCH and DELETE** with proper status codes and error messages.
- The **Study Lab** pages are the exact practice pages from the *Playwright with Python* study material, so every example in the book runs here unchanged. Only the port changes: `8000` becomes `3000`.

---

## Run it

Requires **Node.js 18 or newer**. There are no dependencies, so you don't need `npm install`.

```bash
node server.js          # or: npm start
```

Open **http://localhost:3000**. API base URL: **http://localhost:3000/api**

Change the port with `PORT=4000 node server.js` (Windows PowerShell: `$env:PORT=4000; node server.js`).

> UI-only alternative: `cd public && python -m http.server 8000` serves the pages, and the shop falls back to built-in product data.
> The API, `/basic-auth` and the order endpoint need `node server.js`.

---

## Credentials

| Where | Username | Password | Result |
|---|---|---|---|
| Login page + API | `admin` | `admin@1234` | Success |
| Login page + API | `student` | `student@1234` | Success |
| Login page + API | `locked_user` | `admin@1234` | "Sorry, this user has been locked out." / 403 |
| Sign-up page | any email you register | your password | Success (stored in the browser) |
| `/basic-auth` | `admin` | `admin` | HTTP Basic Auth success page |

A successful login sets the cookie `session-username` and the localStorage key `rohit.auth`, so you can practise cookies and `storage_state`.
`/profile.html` is a secure page that redirects to the login page when you're signed out.

---

## Pages

| Page | URL | What to practise |
|---|---|---|
| Login | `/` or `/login` | Validation messages, password toggle, radio, remember me, locked user, redirect after login |
| Sign up / Forgot password | `/signup`, `/forgot-password` | Field-level errors, password strength, success messages |
| Overview | `/home.html` | Navigation, cards |
| **Practice Elements** | `/dashboard` | Inputs, textarea, read-only/disabled, buttons, links, radio, checkbox, toggle, `<select>`, multi-select, span dropdown, auto-suggest, date, file + multi-file upload, hover, double/right click, slider, resize, drag & drop, alerts, HTML modal, iframe, hide/show, new tab/window, bad SSL, waits, shadow DOM, dynamic XPath. **Click the ⓘ icon for Selenium Java/Python, Cypress and Playwright code.** |
| Forms | `/forms.html` | Every HTML5 input type (number, tel, url, color, date, time, datetime-local, month, week, range), optgroup, datalist, cascading Country → State, captcha, validation summary, submitted-data table, multi-step wizard |
| UI Components | `/components.html` | Tabs, accordion, confirm modal, toasts, tooltips, click menu, multi-level hover menu, progress bar, spinner, carousel, star rating, tags input, quantity stepper, clipboard |
| Web Tables | `/webtable` | Pagination (fixed), rows-per-page, search, select-all checkboxes, row actions, column totals, sortable CRUD table |
| Waits & Dynamic | `/waits.html` | Hidden vs. rendered-later elements, enable/disable, add/remove, text/class changes, countdown, delayed alert, AJAX, infinite scroll, stale elements |
| Frames & Windows | `/frames.html` | Single, nested and `srcdoc` iframes, new tab, popup, multiple windows |
| Advanced Elements | `/advanced.html` | Nested shadow DOM, keyboard keys & shortcuts, SVG, canvas, downloads (csv/txt/json/pdf/generated), visibility types, intercepted clicks, horizontal scroll, `::before` text, rich-text editor, custom context menu, cookies, localStorage, geolocation, broken images & links, page scrolling |
| Shop | `/store` → `/cart` → `/checkout` | Product grid, search, filter, sort, product details, cart quantities, 3-step checkout, order created through the API |
| API Playground | `/api.html` | Try every endpoint in the browser; download the Postman collection and environment |
| Secure Area | `/profile.html` | Pages that need a login, cookies, session reuse |
| **Study Lab: Practice Form** | `/practice-form.html` | Modules 04–06 of the study material |
| **Study Lab: Widgets** | `/widgets.html` (+ `payment.html`, `help.html`, `report.csv`) | Module 07: frames, popups, dialogs, downloads, tables, date picker, auto-suggest, hover menu |
| **Study Lab: Mini Shop** | `/shop.html` (+ `/api/products.json`, `/api/cart`) | Module 13: network events, `expect_response`, `page.route` mocking |

### Works with every tool

- **Drag & drop** works with native HTML5 drag events *and* plain mouse events, so Selenium's `Actions.dragAndDrop`, Cypress `trigger()`, and Playwright `drag_to` all work.
- **Hover menus** open on CSS `:hover` *and* on a `mouseover` event, so Cypress `trigger('mouseover')` works too.
- All iframes are **same-origin**, so Cypress can reach inside them.
- Only the "Dynamic Xpath" field changes its `id` on purpose (`dynamic_1234`); everything else is stable.

---

## REST API

Base URL: `http://localhost:3000/api`. All responses are JSON. Data is kept in memory; `POST /api/reset` or a server restart restores it.

| Method | Endpoint | Auth | Success | Errors |
|---|---|---|---|---|
| POST | `/auth/login` `{username, password}` | – | 200 `{token, token_type, expires_in, user}` | 400, 401, 403 |
| GET | `/auth/me` | Bearer | 200 | 401 |
| GET | `/users?page=&limit=&status=&city=&search=` | – | 200 `{page, limit, total, total_pages, data}` | – |
| GET | `/users/:id` | – | 200 | 400, 404 |
| POST | `/users` `{name, email, job?, city?, status?}` | – | **201** + `Location` header | 400, 409 |
| PUT | `/users/:id` (full body) | Bearer | 200 (adds `updated_at`) | 400, 401, 404, 409 |
| PATCH | `/users/:id` (some fields) | Bearer | 200 | 400, 401, 404, 409 |
| DELETE | `/users/:id` | Bearer | 200 `{message, id}` | 401, 404 |
| GET | `/products?category=&search=&sort=&in_stock=true` | – | 200 `{total, data}` | 400 (bad sort) |
| GET | `/products/:id` | – | 200 | 404 |
| POST | `/cart` `{id, qty}` | – | 200 `{message, item}` | 400, 404, 409 (out of stock) |
| POST | `/orders` `{customer:{first_name,last_name,postal_code}, items:[{id,qty}]}` | – | **201** | 400, 404 |
| GET | `/orders/:id` | – | 200 | 404 |
| ANY | `/echo` | – | 200, echoes method/query/headers/body | – |
| GET | `/status/:code` | – | the code you ask for | – |
| GET | `/delay/:seconds` (max 10) | – | 200 after the delay | – |
| GET | `/health` | – | 200 `{status: "UP"}` | – |
| POST | `/reset` | – | 200 | – |

Wrong method on a valid path → **405**. Unknown path → **404**. Bad JSON → **400**.
Send the token as `Authorization: Bearer <token>`. Bodies can be JSON or `x-www-form-urlencoded`.

### Postman

Import `public/downloads/Rohit-Automation-API.postman_collection.json` and `...postman_environment.json`
(or download them from the API Playground page). The collection has **32 requests** in run order,
each with a test named `Verify_the_response_data_C<id>`. Run the whole collection with the Collection Runner, and every test passes.

---

## Hosting

- **Any Node host (Render, Railway, a VM):** start command `node server.js`. Everything works.
- **Netlify:** `netlify.toml` publishes `public/` and runs the API and `/basic-auth` as a Netlify Function (`netlify/functions/api.js`).
  Serverless instances keep data only while warm, so a user created with POST may not be there on the next GET.
  For stable API practice, use `node server.js`.
- Old URLs still work: `/dashboard`, `/webtable`, `/dashboard/dashboard.html`, `/signupPage/signup.html`, `/forgotPassword/forgotPassword.html`.

---

## Project structure

```
server.js                 Node http server: static site + API + basic auth (no dependencies)
server/api.js             All API routes (also used by the Netlify function)
server/data.js            Seed users and products
netlify/functions/api.js  Netlify wrapper
public/                   The website
  index.html, indexScript.js         Login
  dashboard/dashboard.html           Practice Elements (old ids kept)
  forms.html, components.html, waits.html, frames.html, advanced.html, webTable.html
  store/ (store, product, cart, checkout)
  api.html                            API Playground
  practice-form.html, widgets.html, shop.html, payment.html, help.html   Study Labs
  assets/css/app.css, assets/js/app.js   Shared design system and app shell
  downloads/                          Download practice files + Postman collection
```

---

## What changed from v1 (bug fixes)

- `server.js` served a non-existent `public` folder and put the whole site behind Basic Auth. Now Basic Auth only protects `/basic-auth`.
- Web table: clicking page **1** jumped to page 2, because "Next" and page 1 used the same value. Fixed, and Previous/Next now disable at the ends.
- Three alert buttons shared `id="idalert"`. They're now `idalert`, `idconfirm` and `idprompt`.
- The slider threw `ReferenceError: resetTimer is not defined` on every move.
- Buttons inside the form had no `type`, so "Upload Here" submitted and reloaded the page.
- Result messages were coloured black on the dark theme, so they were invisible. Messages also no longer disappear after 5 seconds, which made tests flaky.
- The code-snippet popup loaded files that didn't exist (`selenium-python.txt`, `cypress-js.txt`, and `selenium-java.txt` from the wrong folder). Snippets are now built in for 33 elements in four tools.
- The iframe, webtable, new-tab and new-window links pointed at the live Netlify site. They now use local pages.
- Drag & drop now also works with Selenium (HTML5-only drag events don't fire from WebDriver).
- The "Forgot password?" link had a wrong `href` (it only worked through JavaScript), sign-up had no submit logic, and the contact form used `mailto:`. All three are fixed.
- `webTable.html` requested files that did not exist (`/dashboardScript.js`, `dashboardImage.jpg`, `../icon.jpg`).
