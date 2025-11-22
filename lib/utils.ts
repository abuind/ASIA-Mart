import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | bigint) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(price));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

// Parse images from JSON string (SQLite stores arrays as JSON strings)
export function parseImages(images: string | string[]): string[] {
  if (Array.isArray(images)) {
    return images;
  }
  try {
    return JSON.parse(images || '[]');
  } catch {
    return images ? [images] : [];
  }
}

// Parse shipping address from JSON string
export function parseShippingAddress(address: string | any): any {
  if (typeof address === 'object' && address !== null) {
    return address;
  }
  try {
    return JSON.parse(address || '{}');
  } catch {
    return {};
  }
}

