import path from "path";
import fs from "fs/promises";

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL;

export async function uploadImage(
  buffer: Buffer,
  filename: string
): Promise<string> {
  if (BUNNY_STORAGE_ZONE && BUNNY_API_KEY && BUNNY_CDN_URL) {
    return uploadToBunny(buffer, filename);
  }
  return uploadToLocal(buffer, filename);
}

async function uploadToBunny(buffer: Buffer, filename: string): Promise<string> {
  const url = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/products/${filename}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      AccessKey: BUNNY_API_KEY!,
      "Content-Type": "application/octet-stream",
    },
    body: buffer,
  });

  if (!response.ok) {
    throw new Error(`Bunny.net upload failed: ${response.statusText}`);
  }

  return `${BUNNY_CDN_URL}/products/${filename}`;
}

async function uploadToLocal(buffer: Buffer, filename: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  return `/uploads/products/${filename}`;
}

export async function deleteImage(url: string): Promise<void> {
  if (url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", url);
    try {
      await fs.unlink(filePath);
    } catch {
      // File may not exist, ignore
    }
    return;
  }

  if (BUNNY_STORAGE_ZONE && BUNNY_API_KEY && BUNNY_CDN_URL) {
    const filename = url.replace(`${BUNNY_CDN_URL}/`, "");
    const deleteUrl = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${filename}`;

    await fetch(deleteUrl, {
      method: "DELETE",
      headers: { AccessKey: BUNNY_API_KEY },
    });
  }
}
