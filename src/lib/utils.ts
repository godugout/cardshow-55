
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate unique card IDs
export const generateCardId = (): string => {
  return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
