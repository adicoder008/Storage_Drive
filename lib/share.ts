import crypto from "node:crypto";

const SECRET = process.env.SHARE_SECRET || "super-secret-key";

export function generateShareToken(fileId: string, expires: number) {
  const payload = `${fileId}:${expires}`;

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");

  return `${payload}:${signature}`;
}


export function verifyShareToken(token: string) {
  const [fileId, expires, signature] = token.split(":");

  const payload = `${fileId}:${expires}`;

  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");

  if (signature !== expectedSignature) {
    throw new Error("Invalid token");
  }

  if (Date.now() > Number(expires)) {
    throw new Error("Link expired");
  }

  return fileId;
}


export async function generateShareLink(fileId: string) {

  const expires = Date.now() + 1000 * 60 * 10; // 10 minutes

  const token = generateShareToken(fileId, expires);

  return `${process.env.NEXT_PUBLIC_APP_URL}/share/${token}`;
}