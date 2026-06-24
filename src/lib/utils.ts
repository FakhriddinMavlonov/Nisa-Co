import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(price);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateFilename(originalName: string): string {
  const ext = originalName.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}.${ext}`;
}

export function buildWhatsAppUrl(
  phone: string,
  message: string
): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function buildWhatsAppMessage(
  items: Array<{ name: string; size?: string; quantity: number; price: number }>,
  total: number,
  currency = "GBP"
): string {
  const itemsText = items
    .map(
      (item) =>
        `• ${item.name}${item.size ? ` (${item.size})` : ""} x${item.quantity} — ${formatPrice(item.price * item.quantity, currency)}`
    )
    .join("\n");

  return `Hello! I would like to order:\n\n${itemsText}\n\nTotal: ${formatPrice(total, currency)}\n\nPlease confirm availability.`;
}

export type Locale = "en" | "uz" | "no" | "sv" | "es";

export function getLocalizedField(
  obj: object,
  field: string,
  locale: Locale
): string {
  const record = obj as Record<string, unknown>;
  const localeSuffix = locale.charAt(0).toUpperCase() + locale.slice(1);
  const key = `${field}${localeSuffix}`;
  return (record[key] as string) || (record[`${field}En`] as string) || "";
}
