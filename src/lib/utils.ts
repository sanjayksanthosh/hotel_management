import { v4 as uuidv4 } from "uuid";

export function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function generateReference(): string {
  const prefix = "HTL";
  const suffix = uuidv4().replace(/-/g, "").substring(0, 12).toUpperCase();
  return `${prefix}-${suffix}`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const diff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calculateTotal(
  pricePerNight: number,
  checkIn: Date,
  checkOut: Date
): number {
  const nights = calculateNights(checkIn, checkOut);
  return nights * pricePerNight;
}
