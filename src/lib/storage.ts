import { put, del } from "@vercel/blob";
import path from "path";
import fs from "fs/promises";

const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Uploads an image and returns its public URL.
 * - On Vercel (BLOB_READ_WRITE_TOKEN set): stores in Vercel Blob.
 * - Locally (no token): falls back to public/uploads for `next dev`.
 */
export async function uploadImage(
  buffer: Buffer,
  filename: string
): Promise<string> {
  if (hasBlobToken) {
    const storeAccess = process.env.BLOB_ACCESS === "private" ? "private" : "public";
    const blob = await put(`products/${filename}`, buffer, {
      access: storeAccess,
    });
    return blob.url;
  }
  return uploadToLocal(buffer, filename);
}

async function uploadToLocal(buffer: Buffer, filename: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
  return `/uploads/products/${filename}`;
}

/**
 * Deletes an image given its stored URL.
 * Handles both local uploads and Vercel Blob URLs.
 */
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

  if (hasBlobToken && url.includes("blob.vercel-storage.com")) {
    try {
      await del(url);
    } catch {
      // Already deleted or unreachable, ignore
    }
  }
}
