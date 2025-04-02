import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function formatDate(lastvisit: Date, addSuffix = true): string {
  if (isToday(lastvisit)) {
    return "Aujourd'hui";
  } else if (isYesterday(lastvisit)) {
    return "Hier";
  } else {
    return formatDistanceToNow(lastvisit, { locale: fr, addSuffix: true });
  }
}