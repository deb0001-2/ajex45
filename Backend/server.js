const http = require("http");
const { handleRequest } = require("./src/router");

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((err) => {
    console.error("Unhandled error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n  Odo HRMS backend running at http://localhost:${PORT}`);
  console.log(`  Try:  curl http://localhost:${PORT}/api/health\n`);
});
