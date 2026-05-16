import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount).replace("Rp", "Rp ")
}

export function formatDate(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions
) {
  return new Date(value).toLocaleDateString("id-ID", options)
}
