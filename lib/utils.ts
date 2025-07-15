import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert a prisma obj to a plain obj
export function convertToPlainObj<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format price
export function formatNumberWithDecimal(num: number): string {
  const [int, dec] = num.toString().split('.');
  return dec ? `${int}.${dec}`.padEnd(2, '0') : `${int}.00`;
}

// Format error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  if (error.name === 'ZodError') {
    // Handle Zod errors
    const fieldErrors = Object.keys(error.errors).map((field) => error.errors[field].message);
    return fieldErrors.join('. ');
  } else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
    // Handle Prisma errors
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} existe déjà`; 
  } else {
    // Others errors...
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
  }
}

// Round number to 2 decimal places
export function round2(value: number | string) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value is not a number or string');
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
});

// Format currency using the formatter above
export function formatCurrency(amount: number | string | null) {
  if(typeof amount === 'number') return CURRENCY_FORMATTER.format(amount);
  if(typeof amount === 'string') return CURRENCY_FORMATTER.format(Number(amount));
  return 'NaN';
}

// Format Number
const NUMBER_FORMATTER = new Intl.NumberFormat('fr-FR');

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'long', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: false, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'fr-FR',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'fr-FR',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'fr-FR',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Pagination links
export function buildUrlQuery({ params, key, value }: { params: string; key: string; value: string | null; }) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl({ url: window.location.pathname, query }, { skipNull: true });
}



