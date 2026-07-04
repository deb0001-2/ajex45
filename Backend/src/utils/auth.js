const crypto = require("crypto");

// In production, set JWT_SECRET as a real environment variable.
const SECRET = process.env.JWT_SECRET || "odo-hrms-dev-secret-change-me";
const TOKEN_TTL_SECONDS = 12 * 60 * 60; // 12 hours

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Buffer.from(str, "base64").toString("utf8");
}

function hmac(input) {
  return crypto
    .createHmac("sha256", SECRET)
    .update(input)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Minimal HS256 JWT implementation (header.payload.signature) - no external deps needed.
function sign(payload, expiresInSeconds = TOKEN_TTL_SECONDS) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };
  const headerEnc = base64url(JSON.stringify(header));
  const payloadEnc = base64url(JSON.stringify(fullPayload));
  const signature = hmac(`${headerEnc}.${payloadEnc}`);
  return `${headerEnc}.${payloadEnc}.${signature}`;
}

function verify(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerEnc, payloadEnc, signature] = parts;
  const expected = hmac(`${headerEnc}.${payloadEnc}`);

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64urlDecode(payloadEnc));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  const hashBuf = Buffer.from(hash, "hex");
  const checkBuf = Buffer.from(check, "hex");
  return hashBuf.length === checkBuf.length && crypto.timingSafeEqual(hashBuf, checkBuf);
}

module.exports = { sign, verify, hashPassword, verifyPassword };
