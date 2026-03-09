import crypto from "crypto";

export async function generateFileHash(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const hash = crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");

  return hash;
}