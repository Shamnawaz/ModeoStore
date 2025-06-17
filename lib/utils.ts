import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convertit un objet prisma en un objet JS
export function convertToPlainObj<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
