import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convertit un objet prisma en un objet JS
export function convertToPlainObj<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Permet le formatage d'un nombre pour avoir deux décimales
export function formatNumberWithDecimal(num: number): string {
  const [int, dec] = num.toString().split('.');
  return dec ? `${int}.${dec}`.padEnd(2, '0') : `${int}.00`;
}
