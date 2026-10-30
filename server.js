// Automation With Rohit - practice web app + REST API.
// No dependencies needed. Start with:   node server.js     (or npm start)
// Then open http://localhost:3000       API base URL: http://localhost:3000/api
const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleApi, basicAuthOk } = require("./server/api");
const ALIASES = require("./server/aliases");

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".pdf": "application/pdf",
  ".xml": "application/xml; charset=utf-8",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function sendFile(res, filePath, status = 200) {
  fs.readFile(filePath, (err, data) => {
    if (err) return notFound(res);
    const type = MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    const headers = { "Content-Type": type };
    if (filePath.includes(`${path.sep}downloads${path.sep}`)) {
      headers["Content-Disposition"] = `attachment; filename="${path.basename(filePath)}"`;
    }
    send(res, status, data, headers);
  });
}

function notFound(res) {
  sendFile(res, path.join(PUBLIC_DIR, "404.html"), 404);
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

function serveStatic(res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (ALIASES[rel.replace(/\/$/, "")]) rel = ALIASES[rel.replace(/\/$/, "")];
  let filePath = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, "Forbidden");

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      const index = path.join(filePath, "index.html");
      return fs.existsSync(index) ? sendFile(res, index) : notFound(res);
    }
    if (!err) return sendFile(res, filePath);
    // allow extension-less URLs: /forms -> /forms.html
    if (!path.extname(filePath) && fs.existsSync(filePath + ".html")) return sendFile(res, filePath + ".html");
    notFound(res);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  try {
    if (pathname === "/api" || pathname.startsWith("/api/")) {
      // the Mini Shop lab reads a plain static file at /api/products.json
      if (pathname === "/api/products.json" && req.method === "GET") return serveStatic(res, pathname);
      const result = await handleApi({
        method: req.method,
        path: pathname.slice(4),
        query: Object.fromEntries(url.searchParams),
        headers: req.headers,
        rawBody: await readBody(req),
      });
      const headers = { ...result.headers };
      let body = "";
      if (result.body !== null && result.body !== undefined) {
        headers["Content-Type"] = "application/json; charset=utf-8";
        body = JSON.stringify(result.body, null, 2);
      }
      return send(res, result.status, body, headers);
    }

    if (pathname === "/basic-auth") {
      if (!basicAuthOk(req.headers["authorization"])) {
        return send(res, 401, "Not authorized", { "WWW-Authenticate": 'Basic realm="Restricted Area"', "Content-Type": "text/plain" });
      }
      return sendFile(res, path.join(PUBLIC_DIR, "dashboard", "AuthPage.html"));
    }

    if (pathname === "/analytics/track") return send(res, 204, "");

    if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Method not allowed");
    serveStatic(res, pathname);
  } catch (e) {
    console.error(e);
    send(res, 500, "Internal server error");
  }
});

server.listen(PORT, () => {
  console.log(`Automation With Rohit is running at  http://localhost:${PORT}`);
  console.log(`Practice API base URL:               http://localhost:${PORT}/api`);
});
