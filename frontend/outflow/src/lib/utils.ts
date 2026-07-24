import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseLocalDateTime(expiresAt: any): string {
  if (!expiresAt) return '';
  if (Array.isArray(expiresAt)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = expiresAt;
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const hh = String(hour).padStart(2, '0');
    const min = String(minute).padStart(2, '0');
    const ss = String(second).padStart(2, '0');
    return `${year}-${mm}-${dd}T${hh}:${min}:${ss}`;
  }
  return String(expiresAt);
}
