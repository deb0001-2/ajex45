const fs = require("fs");
const path = require("path");
const seed = require("./seed");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(seed(), null, 2));
    console.log(`Seeded new database at ${DB_PATH}`);
  }
}

function read() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function write(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { read, write, DB_PATH };
