// Netlify Function: runs the same practice API as server.js, so /api/* and
// /basic-auth also work when the site is hosted on Netlify.
// Note: serverless instances keep data in memory only while warm, so created
// users can disappear between requests. For stable practice run `npm start`.
const fs = require("fs");
const path = require("path");
const { handleApi, basicAuthOk } = require("../../server/api");

exports.handler = async (event) => {
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
  let p = event.path || "/";
  p = p.replace(/^\/\.netlify\/functions\/api/, "/api");

  if (p === "/basic-auth" || p === "/api/basic-auth") {
    if (!basicAuthOk(headers.authorization)) {
      return { statusCode: 401, headers: { "WWW-Authenticate": 'Basic realm="Restricted Area"' }, body: "Not authorized" };
    }
    const html = fs.readFileSync(path.join(__dirname, "../../public/dashboard/AuthPage.html"), "utf8");
    return { statusCode: 200, headers: { "Content-Type": "text/html; charset=utf-8" }, body: html };
  }

  const result = await handleApi({
    method: event.httpMethod,
    path: p.replace(/^\/api/, ""),
    query: event.queryStringParameters || {},
    headers,
    rawBody: event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString() : event.body || "",
  });
  const outHeaders = { ...result.headers };
  if (result.body !== null && result.body !== undefined) outHeaders["Content-Type"] = "application/json; charset=utf-8";
  return {
    statusCode: result.status,
    headers: outHeaders,
    body: result.body === null || result.body === undefined ? "" : JSON.stringify(result.body, null, 2),
  };
};
