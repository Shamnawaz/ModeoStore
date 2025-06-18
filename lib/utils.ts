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

// Formattage des erreurs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  if (error.name === 'ZodError') {
    // Gestion des erreur Zod
    const fieldErrors = Object.keys(error.errors).map((field) => error.errors[field].message);
    return fieldErrors.join('. ');
  } else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
    // Gestion des erreurs prisma
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} existe déjà`; 
  } else {
    // Autres...
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
  }
}
