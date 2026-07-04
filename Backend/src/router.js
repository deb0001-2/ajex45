const { sendJson, parseBody, CORS_HEADERS } = require("./utils/http");
const { verify } = require("./utils/auth");

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const attendanceRoutes = require("./routes/attendance");
const leaveRoutes = require("./routes/leaves");
const miscRoutes = require("./routes/misc");

const routes = [
  ...authRoutes,
  ...employeeRoutes,
  ...attendanceRoutes,
  ...leaveRoutes,
  ...miscRoutes,
];

function splitPath(p) {
  return p.split("/").filter(Boolean);
}

function matchRoute(routePath, reqPath) {
  const routeParts = splitPath(routePath);
  const reqParts = splitPath(reqPath);
  if (routeParts.length !== reqParts.length) return null;

  const params = {};
  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(":")) {
      params[routeParts[i].slice(1)] = decodeURIComponent(reqParts[i]);
    } else if (routeParts[i] !== reqParts[i]) {
      return null;
    }
  }
  return params;
}

function getAuthUser(req) {
  const header = req.headers["authorization"] || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  return token ? verify(token) : null;
}

async function handleRequest(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = urlObj.pathname;
  const query = Object.fromEntries(urlObj.searchParams.entries());

  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  for (const route of routes) {
    if (route.method !== req.method) continue;
    const params = matchRoute(route.path, pathname);
    if (!params) continue;

    let body = {};
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      try {
        body = await parseBody(req);
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }

    const user = getAuthUser(req);

    if (route.auth && !user) {
      return sendJson(res, 401, { error: "Authentication required. Provide a Bearer token." });
    }
    if (route.admin && !(user && user.isAdmin)) {
      return sendJson(res, 403, { error: "Admin access required." });
    }

    return route.handler({ req, res, params, query, body, user, sendJson });
  }

  return sendJson(res, 404, { error: `No route matches ${req.method} ${pathname}` });
}

module.exports = { handleRequest };
