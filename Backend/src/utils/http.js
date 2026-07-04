const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json",
    ...CORS_HEADERS,
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    let size = 0;
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_SIZE) {
        req.destroy();
        reject(new Error("Payload too large"));
        return;
      }
      data += chunk;
    });

    req.on("end", () => {
      if (!data.trim()) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error("Invalid JSON in request body"));
      }
    });

    req.on("error", reject);
  });
}

module.exports = { sendJson, parseBody, CORS_HEADERS };
